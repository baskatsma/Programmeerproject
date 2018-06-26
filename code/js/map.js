/*
 *  Programmeerproject
 *  map.js
 *
 *  Creates map of Europe and updates it based on the chosen year.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 *  Based on: http://blog.robertjesionek.com/d3js-geo/
 *
 */

// Define global variables, dimensions and settings
var europe;
var energyUsage;

var map;
var mapCenter = [11, 71.2];
var mapTitleMargin = 90;
var mapMargin = {top: 0, right: 0, bottom: 0, left: 30};

// Create a projection
var projection = d3.geoMercator()
      .center(mapCenter);

// Initialize the path generator
var path = d3.geoPath();

// Initialize map tooltip
var mapTip = d3.tip()
      .attr("class", "d3-tip")
      .attr("id", "mapTooltip")
      .offset([-5, 0]);

// Initialize color scale
var colorScaleMap = d3.scaleQuantize();

function makeMap(year) {

    // Update global variable
    mapSelectedYear = year;

    // Update chart based on screen width/height
    mapWidth = w * 0.475;
    mapHeight = h * 0.685;
    mapScale = 0.785 * mapHeight;

    // Edit projection with new dimensions
    projection
      .scale(mapScale)
      .translate([mapWidth / 2.1, 0]);

    // Generate path
    path
      .projection(projection);

    // Load EU map and energy data
    d3.queue()
      .defer(d3.json, "data/europe.json")
      .defer(d3.json, "data/nrg_100a_Simplified_energy_balances_KTOE.json")
      .await(makeMapCore);
}

function makeMapCore(error, europeData, energyUsageData) {

    // Log any errors, and save results for usage outside of this function
    if (error) throw error;
    europe = europeData;
    energyUsage = energyUsageData;

    // Extract the EUROSTAT data
    storeData = {};
    mapYear = mapSelectedYear;
    energyUsage.forEach(function(d) {
        d[mapYear] = d[mapYear].replace(",",".");
        storeData[d.GEO] = Number(d[mapYear]);
    });

    // Update map tooltip
    mapTip.html(function(d) {

        let mapTooltipText = formatThousand(storeData[d.id]) + " KTOE";

        // If the country has no valid values, report unknown
        if (!isNumber(storeData[d.id])) {
            mapTooltipText = "unknown";
        }

        return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage:</strong> " + mapTooltipText;
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

    // Append countries to the map and color-code + functionalize them
    appendCountries();

    // Add a title
    addTitle(mapYear);

    // Set-up color scale for legend
    colorScaleMap
      .range(colorbrewer.YlOrRd[7])
      .domain([0, 35]);

    // Define legend settings
    var colorLegend = d3.legendColor()
          .labelFormat(formatThousand)
          .scale(colorScaleMap)
          .shapePadding(0)
          .shapeHeight(6)
          .shapeWidth(75)
          .orient("horizontal");

    // Define legend positions
    let xDistance = mapWidth * 0.125;
    let yDistance = mapHeight - 30;

    // Append legend to map
    map.append("g")
      .attr("transform", "translate(" + xDistance + "," + yDistance + ")")
      .call(colorLegend);

    // Add a description to the legend
    map.append("text")
      .attr("x", xDistance - 60)
      .attr("y", yDistance + 7)
      .attr("text-anchor", "left")
      .attr("class", "legendText")
      .text("x10.000");
}

function updateMap(mapSelectedYear) {

    // Select new parts of the EUROSTAT data
    let newMapData = {};
    let newMapYear = mapSelectedYear;
    energyUsage.forEach(function(d) {
        d[newMapYear] = d[newMapYear].replace(",",".");
        newMapData[d.GEO] = Number(d[newMapYear])
    });

    // Update scale
    colorScaleMap
      .range(colorbrewer.YlOrRd[9])
      .domain([0, 350000]);

    // Update map tooltip using the new data
    mapTip.html(function(d) {

        let mapTooltipText = formatThousand(newMapData[d.id]) + " KTOE";

        // If the country has no valid values, report unknown
        if (!isNumber(newMapData[d.id])) {
            mapTooltipText = "unknown";
        }

        return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage:</strong> " + mapTooltipText;
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
      .range(colorbrewer.YlOrRd[9])
      .domain([0, 350000]);

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

      // Add effects on mouseover/-out and add d3-tip functionality
      .on("mouseover", function(d) {
          d3.select(this)
            .style("stroke", "red")
            .style("stroke-width", 0.25)
          mapTip.show(d);
      })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("stroke", "lightgrey")
            .style("stroke-width", 0.25)
          mapTip.hide(d);
      })

      // Add update function on "click"
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

    // Change the text of the year with the updated year
    map.select(".titleText")
      .text(year);
}

var isNumber = function isNumber(value) {

    // Check if the value is a VALID number (NaN otherwise registers as 'number')
    return typeof value === 'number' &&
    isFinite(value);
}

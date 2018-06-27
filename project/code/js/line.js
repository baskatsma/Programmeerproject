/*
 *  Programmeerproject
 *  line.js
 *
 *  Creates a multi-series line chart and updates it based on the renewable resource.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 *  Based on: https://codepen.io/zakariachowdhury/pen/JEmjwq
 *
 */

// Define global variables, dimensions and settings
var totalProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var hydroProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_HYDRO.json";
var windProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_WIND.json";
var solarProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_SOLAR_PHOTOVOLTAIC.json";
var energySelection = "Total";

var lineSelectedSector = "data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var sectorText;

var currentGEO;
var currentGEOColor;
var currentGEOData;
var currentGEOIndex;
var maxProductions = [];

var lineWidth;
var lineHeight;
var titleMargin = 90;
var margin = {top: 15, right: 85, bottom: 60, left: 55};

var gX;
var gY;
var zoomLevel = 1;

var lineOpacity = 0.3;
var lineOpacityHover = 1;
var lineOpacityOthers = 0.1;
var lineStroke = 2;
var lineStrokeHover = 5.5;
var lineStrokeOthers = 0.75;

var circleOpacity = 0.3;
var circleOpacityOnLineHover = 1;
var circleRadius = 3;
var circleRadiusHover = 6;
var circleRadiusOthers = 1;

// Initialize X and Y
var lineX = d3.scaleTime();
var lineY = d3.scaleLinear();

// Initialize zoom
var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

// Initialize X and Y axii
var xAxisLine;
var yAxisLine;

var svg;

// Define color scale
var lineColor = d3.scaleOrdinal(d3.schemeCategory20);

// Initialize barchart tooltip
var circleTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "circleTooltip")
    .offset([-15, 0])
    .html(function(d) {

        // Get year and format it correctly
        let yearOnly = d.year.toISOString().substring(0, 4);
        let yearOnlyCorrected = String(Number(yearOnly) + 1);

        return energySelection.bold() + " (" + yearOnlyCorrected.bold() +
        ")" + ": " + formatThousandDecimal(d.production) + " KTOE";
    });

function makeLineGraph(chosenGEO) {

    // Update chart based on screen width/height
    lineWidth = w * 0.425;
    lineHeight = h * 0.685;

    // Update range for X and Y
    lineX.range([0, lineWidth]);
    lineY.range([lineHeight, 0]);

    // Update zoom min/max dimensions
    zoom
        .translateExtent([[0, 0], [lineWidth, lineHeight]])
        .extent([[0, 0], [lineWidth, lineHeight]]);

    // Initialize X and Y axii
    xAxisLine = d3.axisBottom(lineX);
    yAxisLine = d3.axisLeft(lineY).ticks(7);

    // Save country we're interested in
    currentGEO = chosenGEO;

    d3.json(lineSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Correctly parse the imported data and use it
        formatData(data, currentGEO);
        processData(data, currentGEO);

        // Update Y domain
        lineY.domain([0, d3.max(maxProductions)]).nice();

        // Add SVG
        svg = d3.select("#lineDiv").append("svg")
          .attr("width", lineWidth + margin.right)
          .attr("height", lineHeight + margin.bottom)
          .call(zoom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Call tooltip
        svg.call(circleTip);

        // Add scalable X and Y axii
        appendgXY();

        // Add description text for Y axis
        addYDescription();

        // Add line into SVG and use year/production for X/Y
        var line = d3.line()
            .x(d => lineX(d.year))
            .y(d => lineY(d.production));

        // Initialize lines
        var lines = svg.append("g")
            .attr("class", "lines");

        // Enter data and append a line for each country
        lines.selectAll(".line-group")
          .data(data).enter()
          .append("g")
          .attr("class", "line-group")
          .append("path")
          .attr("class", "line")
          .attr("d", d => line(d.values))

          // Style line color, width and opacity based on the country we want
          .style("stroke", function(d, i) {
              if (d.GEO == currentGEO) { currentGEOColor = lineColor(i) }
              return lineColor(i) })
          .style("stroke-width", function(d) {
              if (d.GEO != currentGEO) { return lineStrokeOthers/zoomLevel } })
          .style("opacity", function(d) {
              if (d.GEO != currentGEO) { return lineOpacity } })

          // Add mouseover and mouseout functions
          .on("mouseover", function(d, i) {

              // Reset all style
              d3.selectAll(".title-text").remove();
              d3.selectAll(".title-extra-text").remove();
              d3.selectAll(".line").transition().duration(300)
                .style("stroke-width", lineStrokeOthers/zoomLevel)
              d3.selectAll("circle").transition().duration(300)
                .style("opacity", circleOpacity)
                .attr("r", circleRadiusOthers/zoomLevel);

              // Highlight line when it is hovered over
              d3.select(this).transition().duration(300)
                .style("opacity", lineOpacityHover)
                .style("stroke-width", lineStrokeHover/zoomLevel)
                .style("cursor", "pointer");

              // Append text about country that is selected
              svg.append("text")
                .attr("class", "title-text")
                .style("fill", lineColor(i))
                .text(d.GEO_TIME)
                .attr("text-anchor", "left")
                .attr("x", 45)
                .attr("y", 55);

              // Append text about renewable resource that is used
              svg.append("text")
                .attr("class", "title-extra-text")
                .style("fill", lineColor(i))
                .text("> " + energySelection)
                .attr("text-anchor", "left")
                .attr("x", 60)
                .attr("y", 87); })

          .on("mouseout", function(d) {
              d3.selectAll(".line").transition().duration(300)
                .style("stroke-width", lineStroke/zoomLevel)
              d3.selectAll("circle").transition().duration(300)
                .attr("r", circleRadius/zoomLevel);
              d3.select(this)
                .style("opacity", lineOpacity)
                .style("stroke-width", lineStroke/zoomLevel)
                .style("cursor", "none");
              d3.selectAll(".title-text").remove();
              d3.selectAll(".title-extra-text").remove(); });

        // Add circles in the line
        lines.selectAll(".circle-group")
          .data(data).enter()
          .append("g")
          .attr("class", "circle-group")
          .style("fill", (d, i) => lineColor(i))
          .selectAll("circle")
          .data(d => d.values).enter()
          .append("g")
          .attr("class", "circle")
          .append("circle")
          .attr("cx", d => lineX(d.year))
          .attr("cy", d => lineY(d.production))

          // Style circle width and opacity based on the country we want
          .attr("r", function(d) {
              if (d.GEO != currentGEO) { return circleRadiusOthers/zoomLevel } })
          .style("opacity", circleOpacity)

          // Change opacity and radius when the circle is being hovered over
          .on("mouseover", function(d) {
              d3.select(this)
                .transition().duration(300)
                .attr("r", circleRadiusHover/zoomLevel)
                .style("opacity", circleOpacityOnLineHover);
              circleTip.show(d); })
          .on("mouseout", function(d) {
              d3.select(this)
                .transition()
                .duration(300)
                .attr("r", circleRadius/zoomLevel)
                .style("opacity", circleOpacity);
              circleTip.hide(d); });

        // Add title
        addCountryTitle(300);

    });
}

function updateLines(lineSelectedSector, chosenGEO) {

    // Save country we want to visualize
    currentGEO = chosenGEO;

    d3.json(lineSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Correctly parse the imported data and use it
        currentGEO = formatData(data, currentGEO);
        processData(data, currentGEO);

        // Update Y domain
        lineY.domain([0, d3.max(maxProductions)]);

        // Append and animate the Y-axis
        d3.select(".y")
          .transition()
          .duration(800)
          .call(yAxisLine)

        // Update line X and Y
        line = d3.line()
          .x(d => lineX(d.year))
          .y(d => lineY(d.production));

        lines2 = svg.selectAll(".line")

          // Reset style to base values
          .style("stroke-width", lineStrokeOthers/zoomLevel)
          .style("opacity", lineOpacity)

          // Add new data and transition it
          .data(data)
          .transition().duration(800)
          .attr("d", d => line(d.values))

          // Style line color, width and opacity based on the country we want
          .style("stroke", function(d, i) {
              if (d.GEO == currentGEO) { currentGEOColor = lineColor(i) }
              return lineColor(i) })
          .style("stroke-width", function(d) {
              if (d.GEO != currentGEO) { return lineStrokeOthers/zoomLevel } })
          .style("opacity", function(d) {
              if (d.GEO != currentGEO) { return lineOpacity } });

        // Update circles in the line
        var circles2 = svg.selectAll(".circle-group")
            .data(data)
            .selectAll("circle")
            .attr("r", circleRadiusOthers/zoomLevel)
            .style("opacity", circleOpacity)
            .data(d => d.values)
            .transition().duration(800)
            .attr("cx", d => lineX(d.year))
            .attr("cy", d => lineY(d.production));

        // Remove country title and animate new title
        d3.selectAll(".title-text").remove();
        d3.selectAll(".title-extra-text").remove();
        addCountryTitle(800);

    });

}

function formatData(data, currentGEO) {

    let allCountries = [];

    // Format data
    data.forEach(function(d) {
        allCountries.push(d.GEO);
        d.values.forEach(function(d) {
            d.year = parseDate(d.year);
            d.production = +d.production;
        });
    });

    // If the country is not in the data list file, use NL
    if (containsCountry(allCountries, currentGEO)) {
        return currentGEO;

    } else {
        currentGEO = "NL";
        return currentGEO;
    }
}

function processData(data, currentGEO) {

    // Save the data of the country we're interested in
    maxProductions = [];

    // Loop over all countries
    for (country in data) {

        // Get max values
        var maxProduction = d3.max(data[country].values, d => d.production)
        maxProductions.push(maxProduction)

        // Find selected country
        if (data[country].GEO == currentGEO) {

            // Save its data and its spot in the data array
            currentGEOData = data[country];
            currentGEOIndex = country;
        }
    }

    // Set the X domain based on the values of the chosen country
    lineX.domain(d3.extent(data[currentGEOIndex].values, d => d.year));

}

function appendgXY() {

    // Add X and Y axis to the SVG
    gX = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + lineHeight + ")")
      .call(xAxisLine);
    gY = svg.append("g")
      .attr("class", "y axis")
      .call(yAxisLine);
}

function addYDescription() {

    // Add Y axis description text
    svg.append("text")
      .attr("class", "yAxis-text")
      .attr("x", -110)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Production (KTOE)");
}

function addCountryTitle(durationTime) {

    // Add selected country text
    svg.append("text")
      .attr("class", "title-text")
      .style("fill", currentGEOColor)
      .text(currentGEOData.GEO_TIME)
      .attr("text-anchor", "left")
      .attr("x", 55)
      .attr("y", 55)
      .transition().duration(durationTime)
      .attr("x", 45);

    // Add selected country text
    svg.append("text")
      .attr("class", "title-extra-text")
      .style("fill", currentGEOColor)
      .text("> " + energySelection)
      .attr("text-anchor", "left")
      .attr("x", 40)
      .attr("y", 87)
      .transition().duration(durationTime)
      .attr("x", 60);
}

// Look through a list and return True if the item we're interested in is present
function containsCountry(list, currentGEO) {
    return list.some(function (el) {
        return el === currentGEO;
    });
}

function zoomed() {

    // Save the current zoom level to correctly scale items
    zoomLevel = d3.event.transform.k;

    // Allow all lines and circles to scale
    svg.selectAll(".line-group").attr("transform", d3.event.transform);
    svg.selectAll(".circle").attr("transform", d3.event.transform);

    let scaledStrokeWidth = (lineStroke/zoomLevel);
    let scaledCircleWidth = (circleRadius/zoomLevel);

    // Calculate new sizes to match the scale
    d3.selectAll(".line").style("stroke-width", scaledStrokeWidth);
    d3.selectAll("circle").attr("r", scaledCircleWidth);
    d3.selectAll(".popup-text").style("font-size", 23/zoomLevel);

    // Rescale axii
    gX.call(xAxisLine.scale(d3.event.transform.rescaleX(lineX)));
    gY.call(yAxisLine.scale(d3.event.transform.rescaleY(lineY)));
}

/*
 *  line.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: https://bl.ocks.org/mbostock/3886394

// Define global variables, dimensions and settings
var parseDate = d3.timeParse("%Y");
var formatThousand = d3.format(",");
var formatDecimal = d3.format(".1f");

var totalProductionJSON = "../data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var windProductionJSON = "../data/ten00081_Primary_production_of_renewable_energy_WIND.json";
var solarProductionJSON = "../data/ten00081_Primary_production_of_renewable_energy_SOLAR_PHOTOVOLTAIC.json";
var hydroProductionJSON = "../data/ten00081_Primary_production_of_renewable_energy_HYDRO.json";

var lineSelectedSector = "../data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var lineSelectedYear = 2007;
var sectorText;

var currentGEO;
var currentGEOColor;
var currentGEOData;
var currentGEOIndex;
var maxProductions = [];

var lineWidth = 560;
var lineHeight = 580;
var titleMargin = 90;
var margin = {top: 30, right: 85, bottom: 60, left: 55};

var xAxis;
var yAxis;
var gX;
var gY;
var zoomLevel = 1;

var lineOpacity = 0.3;
var lineOpacityHover = 1;
var lineOpacityOthers = 0.1;
var lineStroke = 3;
var lineStrokeHover = 5.5;
var lineStrokeOthers = 1;

var circleOpacity = 0.3;
var circleOpacityOnLineHover = 1;
var circleRadiusOthers = 1;
var circleRadius = 3;
var circleRadiusHover = 6;

var zoom = d3.zoom()
    .scaleExtent([1, 4])
    .on("zoom", zoomed);

var x = d3.scaleTime()
    .range([0, lineWidth]);

var y = d3.scaleLinear()
    .range([lineHeight, 0]);

var lineColor = d3.scaleOrdinal(d3.schemeCategory20);

function makeLineGraph(currentGEO) {

    d3.json(lineSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Save the data of the country we're interested in
        modifyData(data, currentGEO);


        try {

            // Set the X domain based on the values of the chosen country
            x.domain(d3.extent(data[currentGEOIndex].values, d => d.year));

        }
        catch(error) {

            // If no data exists for the chosen country, pick NL
            x.domain(d3.extent(data[18].values, d => d.year));
            currentGEO = "NL";
            modifyData(data, currentGEO);

        }

        // Update Y domain
        y.domain([0, d3.max(maxProductions)]);

        // Add SVG
        var svg = d3.select("#lineDiv").append("svg")
          .attr("width", lineWidth + margin.right)
          .attr("height", lineHeight + margin.bottom)
          .call(zoom)
          .append('g')
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Initialize X and Y axii
        xAxis = d3.axisBottom(x);
        yAxis = d3.axisLeft(y).ticks(7);

        gX = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + lineHeight + ")")
            .call(xAxis);
        gY = svg.append("g")
             .attr("class", "y axis")
             .call(yAxis)

        /* Add line into SVG */
        var line = d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(d.production) });

        var lines = svg.append('g')
          .attr('class', 'lines');

        lines.selectAll('.line-group')
          .data(data).enter()
          .append('g')
          .attr('class', 'line-group')
          .append('path')
          .attr('class', 'line')
          .attr('d', d => line(d.values))
          .style('stroke', function(d, i) {
              if (d.GEO == currentGEO) { currentGEOColor = lineColor(i) }
              return lineColor(i)
          })
          .style('stroke-width', function(d) {
              if (d.GEO != currentGEO) { return lineStrokeOthers/zoomLevel }
          })
          .style('opacity', function(d) {
              if (d.GEO != currentGEO) { return lineOpacity }
          })
          .on("mouseover", function(d, i) {
              d3.selectAll('.title-text').remove();
              console.log(d);
              d3.selectAll('.line').transition().duration(300)
                .style('stroke-width', lineStrokeOthers/zoomLevel)
              d3.selectAll('circle').transition().duration(300)
                .attr("r", circleRadiusOthers/zoomLevel);
              d3.select(this).transition().duration(300)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover/zoomLevel)
                .style("cursor", "pointer");
              svg.append("text")
                .attr("class", "title-text")
                .style("fill", lineColor(i))
                .text(d.GEO_TIME)
                .attr("text-anchor", "left")
                .attr("x", 45)
                .attr("y", 65)
                .transition().duration(300)
                .attr("y", 55);
          })
          .on("mouseout", function(d) {
              d3.selectAll('.line').transition().duration(300)
                .style('stroke-width', lineStroke/zoomLevel)
              d3.selectAll('circle').transition().duration(300)
                .attr("r", circleRadius/zoomLevel);
              d3.select(this)
                .style('opacity', lineOpacity)
                .style("stroke-width", lineStroke/zoomLevel)
                .style("cursor", "none");
              d3.selectAll('.title-text').remove();
          });

        /* Add circles in the line */
        lines.selectAll("circle-group")
          .data(data).enter()
          .append("g")
          .style("fill", (d, i) => lineColor(i))
          .selectAll("circle")
          .data(d => d.values).enter()
          .append("g")
          .attr("class", "circle")
          .on("mouseover", function(d) {
              console.log(d);
              d3.select(this)
                .style("cursor", "pointer")
                .append("text")
                .attr("class", "popup-text")
                .text(formatThousand(d.production))
                .style("font-size", 23/zoomLevel)
                .attr("x", d => x(d.year) - 35/zoomLevel)
                .attr("y", d => y(d.production) - 8/zoomLevel)
                .transition().duration(300)
                .attr("y", d => y(d.production) - 15/zoomLevel);
          })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")
                .selectAll(".popup-text").remove();
          })
          .append("circle")
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.production))
          .attr('r', function(d) {
              if (d.GEO != currentGEO) { return circleRadiusOthers/zoomLevel }
          })
          .style('opacity', circleOpacity)
          .on("mouseover", function(d) {
              d3.select(this)
                .transition().duration(300)
                .attr("r", circleRadiusHover/zoomLevel)
                .style("opacity", circleOpacityOnLineHover);
          })
          .on("mouseout", function(d) {
              d3.select(this)
                .transition()
                .duration(300)
                .attr("r", circleRadius/zoomLevel)
                .style("opacity", circleOpacity);
          });

        svg.append("text")
          .attr("class", "title-text")
          .style("fill", currentGEOColor)
          .text(currentGEOData.GEO_TIME)
          .attr("text-anchor", "left")
          .attr("x", 45)
          .attr("y", 65)
          .transition().duration(300)
          .attr("y", 55);

          // /* Add Axis into SVG */
          // var xAxis = d3.axisBottom(x);
          // var yAxis = d3.axisLeft(y).ticks(7);
          //
          // svg.append("g")
          //   .attr("class", "x axis")
          //   .attr("transform", "translate(0,600)")
          //   .call(xAxis);
          //
          // svg.append("g")
          //   .attr("class", "y axis")
          //   .call(yAxis)
          //   .append('text')
          //   .attr("y", 15)
          //   .attr("transform", "rotate(-90)")
          //   .attr("fill", "#000")
          //   .text("Total values");

    });

}
//
// // Execute main code after loading the DOM
// document.addEventListener("DOMContentLoaded", function() {
//
//     d3.json(lineSelectedSector, function(error, data) {
//
//         // Log any errors, and save results for usage outside of this function
//         if (error) throw error;
//
//         currentGEO = "NL";
//
//         // Format data
//         data.forEach(function(d) {
//             d.values.forEach(function(d) {
//                 d.year = parseDate(d.year);
//                 d.production = +d.production;
//             });
//         });
//
//         // Loop over all countries
//         var maxProductions = [];
//         for (country in data) {
//
//             // Get max values
//             var maxProduction = d3.max(data[country].values, d => d.production)
//             maxProductions.push(maxProduction)
//
//             // Find selected country
//             if (data[country].GEO == currentGEO) {
//
//                 // Save its data and its spot in the data array
//                 currentGEOData = data[country];
//                 currentGEOIndex = country;
//
//             }
//         }
//
//         // Update X and Y domain
//         x.domain(d3.extent(data[currentGEOIndex].values, d => d.year));
//         y.domain([0, d3.max(maxProductions)]);
//
//         var lineColor = d3.scaleOrdinal(d3.schemeCategory20);
//
//         /* Add SVG */
//         var svg = d3.select("#lineDiv").append("svg")
//           .attr("width", lineWidth + margin.right)
//           .attr("height", lineHeight + margin.bottom)
//           .call(zoom)
//           .append('g')
//               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         xAxis = d3.axisBottom(x);
//         yAxis = d3.axisLeft(y).ticks(7);
//
//         gX = svg.append("g")
//             .attr("class", "x axis")
//             .attr("transform", "translate(0," + lineHeight + ")")
//             .call(xAxis);
//         gY = svg.append("g")
//              .attr("class", "axis axis--y")
//              .call(yAxis)
//
//         /* Add line into SVG */
//         var line = d3.line()
//           .x(function(d) { return x(d.year) })
//           .y(function(d) { return y(d.production) });
//
//         var lines = svg.append('g')
//           .attr('class', 'lines');
//
//         lines.selectAll('.line-group')
//           .data(data).enter()
//           .append('g')
//           .attr('class', 'line-group')
//           .append('path')
//           .attr('class', 'line')
//           .attr('d', d => line(d.values))
//           .style('stroke', function(d, i) {
//               if (d.GEO == currentGEO) { currentGEOColor = lineColor(i) }
//               return lineColor(i)
//           })
//           .style('stroke-width', function(d) {
//               if (d.GEO != currentGEO) { return lineStrokeOthers/zoomLevel }
//           })
//           .style('opacity', function(d) {
//               if (d.GEO != currentGEO) { return lineOpacity }
//           })
//           .on("mouseover", function(d, i) {
//               console.log(d);
//               d3.selectAll('.line').transition().duration(300)
//                 .style('stroke-width', lineStrokeOthers/zoomLevel)
//               d3.selectAll('circle').transition().duration(300)
//                 .attr("r", circleRadiusOthers/zoomLevel);
//               d3.select(this).transition().duration(300)
//                 .style('opacity', lineOpacityHover)
//                 .style("stroke-width", lineStrokeHover/zoomLevel)
//                 .style("cursor", "pointer");
//               svg.append("text")
//                 .attr("class", "title-text")
//                 .style("fill", lineColor(i))
//                 .text(d.GEO_TIME)
//                 .attr("text-anchor", "left")
//                 .attr("x", 45)
//                 .attr("y", 65)
//                 .transition().duration(300)
//                 .attr("y", 55);
//           })
//           .on("mouseout", function(d) {
//               d3.selectAll('.line').transition().duration(300)
//                 .style('stroke-width', lineStroke/zoomLevel)
//               d3.selectAll('circle').transition().duration(300)
//                 .attr("r", circleRadius/zoomLevel);
//               d3.select(this)
//                 .style('opacity', lineOpacity)
//                 .style("stroke-width", lineStroke/zoomLevel)
//                 .style("cursor", "none");
//               d3.selectAll('.title-text').remove();
//           });
//
//         /* Add circles in the line */
//         lines.selectAll("circle-group")
//           .data(data).enter()
//           .append("g")
//           .style("fill", (d, i) => lineColor(i))
//           .selectAll("circle")
//           .data(d => d.values).enter()
//           .append("g")
//           .attr("class", "circle")
//           .on("mouseover", function(d) {
//               console.log(d);
//               d3.select(this)
//                 .style("cursor", "pointer")
//                 .append("text")
//                 .attr("class", "popup-text")
//                 .text(formatThousand(d.production))
//                 .style("font-size", 23/zoomLevel)
//                 .attr("x", d => x(d.year) - 35/zoomLevel)
//                 .attr("y", d => y(d.production) - 8/zoomLevel)
//                 .transition().duration(300)
//                 .attr("y", d => y(d.production) - 15/zoomLevel);
//           })
//           .on("mouseout", function(d) {
//               d3.select(this)
//                 .style("cursor", "none")
//                 .selectAll(".popup-text").remove();
//           })
//           .append("circle")
//           .attr("cx", d => x(d.year))
//           .attr("cy", d => y(d.production))
//           .attr('r', function(d) {
//               if (d.GEO != currentGEO) { return circleRadiusOthers/zoomLevel }
//           })
//           .style('opacity', circleOpacity)
//           .on("mouseover", function(d) {
//               d3.select(this)
//                 .transition().duration(300)
//                 .attr("r", circleRadiusHover/zoomLevel)
//                 .style("opacity", circleOpacityOnLineHover);
//           })
//           .on("mouseout", function(d) {
//               d3.select(this)
//                 .transition()
//                 .duration(300)
//                 .attr("r", circleRadius/zoomLevel)
//                 .style("opacity", circleOpacity);
//           });
//
//         svg.append("text")
//           .attr("class", "title-text")
//           .style("fill", currentGEOColor)
//           .text(currentGEOData.GEO_TIME)
//           .attr("text-anchor", "left")
//           .attr("x", 45)
//           .attr("y", 65)
//           .transition().duration(300)
//           .attr("y", 55);
//
//           // /* Add Axis into SVG */
//           // var xAxis = d3.axisBottom(x);
//           // var yAxis = d3.axisLeft(y).ticks(7);
//           //
//           // svg.append("g")
//           //   .attr("class", "x axis")
//           //   .attr("transform", "translate(0,600)")
//           //   .call(xAxis);
//           //
//           // svg.append("g")
//           //   .attr("class", "y axis")
//           //   .call(yAxis)
//           //   .append('text')
//           //   .attr("y", 15)
//           //   .attr("transform", "rotate(-90)")
//           //   .attr("fill", "#000")
//           //   .text("Total values");
//
//     });
//
// });

function modifyData(data, currentGEO) {

    // Format data
    data.forEach(function(d) {
        d.values.forEach(function(d) {
            d.year = parseDate(d.year);
            d.production = +d.production;
        });
    });

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
}

function zoomed() {

    zoomLevel = d3.event.transform.k;
    svg = d3.select("#lineDiv").select("svg");

    // Allow all lines and circles to scale
    svg.selectAll(".line-group")
        .attr("transform", d3.event.transform);
    svg.selectAll(".circle")
        .attr("transform", d3.event.transform);

    var scaledStrokeWidth = (lineStroke/zoomLevel);
    var scaledCircleWidth = (circleRadius/zoomLevel);

    // Calculate new sizes to match the scale
    d3.selectAll('.line').style("stroke-width", scaledStrokeWidth);
    d3.selectAll('circle').attr("r", scaledCircleWidth);
    d3.selectAll('.popup-text').style("font-size", 23/zoomLevel);

    // Rescale axii
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
}

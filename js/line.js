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

var totalProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var windProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_WIND.json";
var solarProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_SOLAR_PHOTOVOLTAIC.json";
var hydroProductionJSON = "data/ten00081_Primary_production_of_renewable_energy_HYDRO.json";

var lineSelectedSector = "data/ten00081_Primary_production_of_renewable_energy_TOTAL.json";
var lineSelectedYear = 2007;
var sectorText;

var currentGEO;
var currentGEOData;
var currentGEOIndex;

var lineWidth = 1100;
var lineHeight = 480;
var titleMargin = 85;
var margin = {top: 20, right: 40, bottom: 80, left: 40};

var x = d3.scaleTime()
    .range([0, lineWidth]);

var y = d3.scaleLinear()
    .range([lineHeight, 0]);

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    d3.json(lineSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        currentGEO = "SE";

        // Format data
        data.forEach(function(d) {
            d.values.forEach(function(d) {
                d.year = parseDate(d.year);
                d.production = +d.production;
            });
        });

        // Loop over all countries
        for (country in data) {

            // Find selected country
            if (data[country].GEO == currentGEO) {

                // Save its data and its spot in the data array
                currentGEOData = data[country];
                currentGEOIndex = country;

            }
        }

        // Update X and Y domain
        x.domain(d3.extent(data[currentGEOIndex].values, d => d.year));
        y.domain([0, d3.max(data[currentGEOIndex].values, d => d.production)]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);



    });

});
//
// function makeChart(chartSelectedSector) {
//
//     d3.json(chartSelectedSector, function(error, data) {
//
//         // Log any errors, and save results for usage outside of this function
//         if (error) throw error;
//
//         // Append measurements to the chart
//         var barchart = d3.select(".barchart")
//             .append("svg")
//             .attr("height", chartHeight + 120)
//             .attr("width", chartWidth + 70)
//             g = barchart.append("g")
//               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         var year = chartSelectedYear;
//
//         data.forEach(function(d) {
//             d.totalEnergyPercentage = 100;
//             d.greenEnergyPercentage = Number(d[year]);
//
//             // Limit green energy to 100% to avoid problems
//             if (d.greenEnergyPercentage >= 100) {
//                 d.greenEnergyPercentage = 100;
//             }
//
//             d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
//         });
//
//         // Sort from highest green energy to lowest
//         data.sort(function(a, b) { return b.greenEnergyPercentage-a.greenEnergyPercentage; });
//
//         x.domain(data.map(function(d) { return d.GEO_TIME; }));
//         z.domain(["greenEnergyPercentage", "greyEnergyPercentage"]);
//
//         var serie = g.selectAll(".serie")
//             .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
//             .enter().append("g")
//                 .attr("class", "serie")
//                 .attr("fill", function(d) { return z(d.key); });
//
//         barchart.call(barTip);
//
//         serie.selectAll("rect")
//             .data(function(d) { return d; })
//             .enter().append("rect")
//                 .attr("x", function(d) { return x(d.data.GEO_TIME); })
//                 .attr("y", function(d) { return y(d[1]); })
//                 .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//                 .attr("width", x.bandwidth())
//
//             // Add d3-tip functionality
//             .on("mouseover", function(d) {
//                 d3.select(this).style("opacity", 0.7);
//                 barTip.show(d); })
//             .on("mouseout", function(d) {
//                 d3.select(this).style("opacity", 1);
//                 barTip.hide(d); });
//
//         g.append("g")
//             .attr("class", "xAxis")
//             .attr("transform", "translate(0," + chartHeight + ")")
//             .call(d3.axisBottom(x))
//             .selectAll("text")
//             .attr("transform", "rotate(45)")
//             .attr("text-anchor", "start");
//
//         g.append("g")
//             .attr("class", "yAxis")
//             .call(d3.axisLeft(y).ticks(10, "%"));
//
//         addLegend(barchart);
//
//         });
// }
//
// function updateChart(chartSelectedSector, chartSelectedYear) {
//
//     d3.json(chartSelectedSector, function(error, data) {
//
//         // Log any errors, and save results for usage outside of this function
//         if (error) throw error;
//
//         var t = d3.transition()
//             .duration(1500);
//
//         // Select the current map
//         var barchartNew = d3.select(".barchart").select("svg");
//
//         // Remove 'g' elements
//         d3.select(".barchart").selectAll("g")
//             .remove();
//
//         // Remove titles - NECESSARY!!!!!
//         d3.select(".titleText")
//             .remove();
//
//         d3.select(".sectorText")
//             .remove();
//
//         var g = barchartNew.append("g")
//                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         // Update data
//         var year = chartSelectedYear;
//         data.forEach(function(d) {
//             d.totalEnergyPercentage = 100;
//             d.greenEnergyPercentage = Number(d[year]);
//
//             // Limit green energy to 100% to avoid problems
//             if (d.greenEnergyPercentage >= 100) {
//                 d.greenEnergyPercentage = 100;
//             }
//
//             d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
//         });
//
//         // Sort from highest green energy to lowest
//         data.sort(function(a, b) { return b.greenEnergyPercentage-a.greenEnergyPercentage; });
//
//         x.domain(data.map(function(d) { return d.GEO_TIME; }));
//         // z.domain(["greenEnergyPercentage", "greyEnergyPercentage"]);
//
//         var serieNew = g.selectAll(".serie")
//             .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
//             .enter().append("g")
//                 .attr("class", "serie")
//                 .attr("fill", function(d) { return z(d.key); });
//
//         barchartNew.call(barTip);
//
//         serieNew.selectAll("rect")
//             .data(function(d) { return d; })
//             .enter().append("rect")
//                 .attr("x", function(d) { return x(d.data.GEO_TIME); })
//                 .attr("y", function(d) { return y(d[1]); })
//                 .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//                 .attr("width", x.bandwidth())
//
//             // Add d3-tip functionality
//             .on("mouseover", function(d) {
//                 d3.select(this).style("opacity", 0.7);
//                 barTip.show(d); })
//             .on("mouseout", function(d) {
//                 d3.select(this).style("opacity", 1);
//                 barTip.hide(d); });
//
//         g.append("g")
//             .attr("class", "xAxis")
//             .attr("transform", "translate(0," + chartHeight + ")")
//             .call(d3.axisBottom(x))
//             .selectAll("text")
//             .attr("transform", "rotate(45)")
//             .attr("text-anchor", "start");
//
//         g.append("g")
//             .attr("class", "yAxis")
//             .call(d3.axisLeft(y).ticks(10, "%"));
//
//         addLegend(barchartNew);
//
//         });
//
// }
//
// function addSlider() {
//
//     var yearSlider = d3.sliderHorizontal()
//       .min(2007)
//       .max(2016)
//       .step(1)
//       .width(440)
//       .tickFormat(d3.format(""))
//       .on('onchange', val => {
//           chartSelectedYear = val;
//           updateChart(chartSelectedSector, chartSelectedYear);
//       });
//
//     var g = d3.select("#slider").append("svg")
//       .attr("class", "slider")
//       .attr("width", 600)
//       .attr("height", 55)
//       .append("g")
//       .attr("transform", "translate(50,15)");
//
//     g.call(yearSlider);
// }
//
// function addLegend(barchart, mapSelectedYear) {
//
//     var ordinal = d3.scaleOrdinal()
//         .domain(["% non-renewable energy", "% renewable energy"])
//         .range([ "rgb(220, 220, 220)", "rgb(0, 102, 102)" ]);
//
//     barchart.append("g")
//         .attr("class", "legendOrdinal")
//         .attr("transform", "translate(917, 195)");
//
//     var legendOrdinal = d3.legendColor()
//         .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
//         .shapePadding(10)
//         .scale(ordinal);
//
//     barchart.select(".legendOrdinal")
//         .call(legendOrdinal);
//
//     // Add a year
//     barchart.append("text")
//         .attr("x", chartWidth - 195)
//         .attr("y", titleMargin + 45)
//         .attr("text-anchor", "left")
//         .attr("class", "titleText")
//         .text(chartSelectedYear);
//
//     // Add a sector
//     if (chartSelectedSector == grossFinalJSON) {
//         sectorText = "GROSS FINAL";
//     }
//
//     if (chartSelectedSector == transportJSON) {
//         sectorText = "TRANSPORT";
//     }
//
//     if (chartSelectedSector == electricityJSON) {
//         sectorText = "ELECTRICITY";
//     }
//
//     if (chartSelectedSector == heatcoolJSON) {
//         sectorText = "HEATING, COOLING";
//     }
//
//     barchart.append("text")
//         .attr("x", chartWidth - 194)
//         .attr("y", titleMargin + 85)
//         .attr("text-anchor", "left")
//         .attr("class", "sectorText")
//         .text(sectorText);
// }

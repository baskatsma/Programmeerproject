/*
 *  barchart.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: https://bl.ocks.org/mbostock/3886394

// Define global variables, dimensions and settings
var formatThousand = d3.format(",");
var formatDecimal = d3.format(".1f");

var grossFinalJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var transportJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_TRANSPORT.json";
var electricityJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_ELECTRICITY.json";
var heatcoolJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_HEAT_COOL.json";

var chartSelectedSector = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var chartSelectedYear = 2007;
var sectorText;

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var chartWidth = 1100;
var chartHeight = 480;
var titleMargin = 85;
var margin = {top: 20, right: 40, bottom: 80, left: 40};

// Is goed!
var x = d3.scaleBand()
    .rangeRound([0, chartWidth])
    .paddingInner(0.0175)
    .align(0.1);

// Is goed!
var y = d3.scaleLinear()
    .rangeRound([chartHeight, 0]);

var xAxisBar = d3.axisBottom(x);

// Is goed!
var z = d3.scaleOrdinal()
    .range(["#006666", "rgb(240,240,240)"]);

var stack = d3.stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

var barchart;

// Initialize barchart tooltip
var barTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "barTooltip")
    .offset([-10, 0])
    .html(function(d) {
        return "Energy usage: " + "<strong>" + formatDecimal((d[1]-d[0]) * 100) + "%" + "</strong>";
    });

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    addSlider();

    // Add an event listener for the year selector button
    $(".dropdown-item").on("click", function(event) {
        dropdownSelection = $(this).text();

        if (dropdownSelection == "Gross final") {
            chartSelectedSector = grossFinalJSON;
        }

        if (dropdownSelection == "Transport") {
            chartSelectedSector = transportJSON;
        }

        if (dropdownSelection == "Electricity") {
            chartSelectedSector = electricityJSON;
        }

        if (dropdownSelection == "Heating, cooling") {
            chartSelectedSector = heatcoolJSON;
        }

        updateChart(chartSelectedSector, chartSelectedYear);
    });

    // Load default chart
    makeChart(chartSelectedSector);

});

function mainCode(error, data) {

    // Initialize the map with the successfully loaded data
    if (error) throw error;

}

function makeChart(chartSelectedSector) {

    d3.json(chartSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Append measurements to the chart
        barchart = d3.select(".barchart")
            .append("svg")
            .attr("height", chartHeight + 120)
            .attr("width", chartWidth + 70)
            g = barchart.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var year = chartSelectedYear;

        data.forEach(function(d) {
            d.totalEnergyPercentage = 100;
            d.greenEnergyPercentage = Number(d[year]);

            // Limit green energy to 100% to avoid problems
            if (d.greenEnergyPercentage > 100) {
                d.greenEnergyPercentage = 100;
            }

            d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
        });

        // Sort from highest green energy to lowest
        data.sort((a, b) => b.greenEnergyPercentage-a.greenEnergyPercentage);

        // Define domains
        x.domain(data.map(d => d.GEO_TIME));
        z.domain(["greenEnergyPercentage", "greyEnergyPercentage"]);

        // Create series for grey and green energy
        var serie = g.selectAll(".serie")
            .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
            .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function(d) { return z(d.key); });

        barchart.call(barTip);

        serie.selectAll("rect")
            .data(d => d)
            .enter().append("rect")
                .attr("x", d => x(d.data.GEO_TIME))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width", x.bandwidth())

            // Add d3-tip functionality
            .on("mouseover", function(d) {
                d3.select(this).style("opacity", 0.7);
                barTip.show(d); })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 1);
                barTip.hide(d); });

        g.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxisBar)
            .selectAll("text")
            .attr("transform", "rotate(45)")
            .attr("text-anchor", "start");

        g.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(y).ticks(10, "%"));

        addLegend(barchart);

        });
}

function updateChart(chartSelectedSector, chartSelectedYear) {

    d3.json(chartSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Update data
        var year = chartSelectedYear;
        data.forEach(function(d) {
            d.totalEnergyPercentage = 100;
            d.greenEnergyPercentage = Number(d[year]);

            // Limit green energy to 100% to avoid problems
            if (d.greenEnergyPercentage >= 100) {
                d.greenEnergyPercentage = 100;
            }

            d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
        });

        // Sort from highest green energy to lowest
        data.sort((a, b) => b.greenEnergyPercentage-a.greenEnergyPercentage);

        // Update X domain
        x.domain(data.map(d => d.GEO_TIME));

        // Update X axis
        d3.select(".xAxis")
            .transition()
            .duration(225)
            .call(xAxisBar)

        // Remove legend text
        d3.select(".titleText").remove();
        d3.select(".sectorText").remove();

        // Update serie data
        serie2 = d3.selectAll(".serie")
          .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
          .attr("fill", d => z(d.key));

        // Update rect data and size
        serie2.selectAll("rect")
            .data(d => d)
            .transition().duration(450)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]));

        // Add new legend text
        addLegend(barchart);

        });

}

function addSlider() {

    var yearSlider = d3.sliderHorizontal()
      .min(2007)
      .max(2016)
      .step(1)
      .width(440)
      .tickFormat(d3.format(""))
      .on("onchange", val => {
          chartSelectedYear = val;
          updateChart(chartSelectedSector, chartSelectedYear);
      });

    var g = d3.select("#slider").append("svg")
      .attr("class", "slider")
      .attr("width", 600)
      .attr("height", 55)
      .append("g")
      .attr("transform", "translate(50,15)");

    g.call(yearSlider);
}

function addLegend(barchart, mapSelectedYear) {

    var ordinal = d3.scaleOrdinal()
        .domain(["% non-renewable energy", "% renewable energy"])
        .range([ "rgb(220, 220, 220)", "rgb(0, 102, 102)" ]);

    barchart.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(917, 195)");

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
        .shapePadding(10)
        .scale(ordinal);

    barchart.select(".legendOrdinal")
        .call(legendOrdinal);

    // Add a year
    barchart.append("text")
        .attr("x", chartWidth - 195)
        .attr("y", titleMargin + 45)
        .attr("text-anchor", "left")
        .attr("class", "titleText")
        .text(chartSelectedYear);

    // Add a sector
    if (chartSelectedSector == grossFinalJSON) {
        sectorText = "GROSS FINAL";
    }

    if (chartSelectedSector == transportJSON) {
        sectorText = "TRANSPORT";
    }

    if (chartSelectedSector == electricityJSON) {
        sectorText = "ELECTRICITY";
    }

    if (chartSelectedSector == heatcoolJSON) {
        sectorText = "HEATING, COOLING";
    }

    barchart.append("text")
        .attr("x", chartWidth - 194)
        .attr("y", titleMargin + 85)
        .attr("text-anchor", "left")
        .attr("class", "sectorText")
        .text(sectorText);
}

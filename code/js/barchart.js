/*
 *  barchart.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: https://bl.ocks.org/mbostock/3886394

// Define global variables, dimensions and settings
var grossFinalJSON = "../data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var transportJSON = "../data/nrg_ind_335a_Share_of_energy_from_renewable_sources_TRANSPORT.json";
var electricityJSON = "../data/nrg_ind_335a_Share_of_energy_from_renewable_sources_ELECTRICITY.json";
var heatcoolJSON = "../data/nrg_ind_335a_Share_of_energy_from_renewable_sources_HEAT_COOL.json";

var chartSelectedSector = "../data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var chartSelectedYear = 2007;
var chartSectorText;

var chartWidth = 1100;
var chartHeight = 550;
var chartTitleMargin = 85;
var chartMargin = {top: 20, right: 300, bottom: 120, left: 40};

// Define X axis properties
var chartX = d3.scaleBand()
    .rangeRound([0, chartWidth])
    .paddingInner(0.0175)
    .align(0.1);

// Define Y axis properties
var chartY = d3.scaleLinear()
    .rangeRound([chartHeight, 0]);

// Call X axis
var xAxisBar = d3.axisBottom(chartX);

// Define Z axis (series)
var chartZ = d3.scaleOrdinal()
    // .range(["#006666", "rgb(240,240,240)"]);
    .range(["#006600", "#cccccc"]);

var stack = d3.stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

var barchart;
var barchartTextField;

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

        // Don't follow href
        event.preventDefault();

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

        console.log()

        updateChart(chartSelectedSector, chartSelectedYear);
    });

    // Load default chart
    makeChart(chartSelectedSector);

});

function makeChart(chartSelectedSector) {

    d3.json(chartSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Append measurements to the chart
        barchart = d3.select(".barchart")
            .append("svg")
            .attr("height", chartHeight + chartMargin.bottom)
            .attr("width", chartWidth + chartMargin.right)
            g = barchart.append("g")
              .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

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
        chartX.domain(data.map(d => d.GEO_TIME));
        chartZ.domain(["greenEnergyPercentage", "greyEnergyPercentage"]);

        // Create series for grey and green energy
        var serie = g.selectAll(".serie")
            .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
            .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function(d) { return chartZ(d.key); });

        barchart.call(barTip);

        serie.selectAll("rect")
            .data(d => d)
            .enter().append("rect")
                .attr("x", d => chartX(d.data.GEO_TIME))
                .attr("y", d => chartY(d[1]))
                .attr("height", d => chartY(d[0]) - chartY(d[1]))
                .attr("width", chartX.bandwidth())

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
            .call(d3.axisLeft(chartY).ticks(10, "%"));

        // Create new SVG for the title and description
        barchartTextField = d3.select("#barchartTextDiv")
            .append("svg")
            .attr("height", 200 + chartMargin.bottom)
            .attr("width", 100 + chartMargin.right)
            g = barchartTextField.append("g")
              .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        // Create first legend instance
        addLegend(year);

        });
}

function updateChart(chartSelectedSector, chartSelectedYear) {

    d3.json(chartSelectedSector, function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Update data
        let newYear = chartSelectedYear;
        data.forEach(function(d) {
            d.totalEnergyPercentage = 100;
            d.greenEnergyPercentage = Number(d[newYear]);

            // Limit green energy to 100% to avoid problems
            if (d.greenEnergyPercentage >= 100) {
                d.greenEnergyPercentage = 100;
            }

            d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
        });

        // Sort from highest green energy to lowest
        data.sort((a, b) => b.greenEnergyPercentage-a.greenEnergyPercentage);

        // Update X domain
        chartX.domain(data.map(d => d.GEO_TIME));

        // Update X axis
        d3.select(".xAxis")
            .transition()
            .duration(225)
            .call(xAxisBar)

        // Update serie data
        serie2 = d3.selectAll(".serie")
          .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
          .attr("fill", d => chartZ(d.key));

        // Update rect data and size
        serie2.selectAll("rect")
            .data(d => d)
            .transition().duration(400)
            .attr("y", d => chartY(d[1]))
            .attr("height", d => chartY(d[0]) - chartY(d[1]));

        // Update legend text
        updateLegend();

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
          updateMap(chartSelectedYear);
      });

    var g = d3.select("#slider").append("svg")
      .attr("class", "slider")
      .attr("width", 600)
      .attr("height", 55)
      .append("g")
      .attr("transform", "translate(50,15)");

    g.call(yearSlider);
}

function getSectorText() {

    // Define sector
    if (chartSelectedSector == grossFinalJSON) {
        chartSectorText = "GROSS FINAL";
    }

    if (chartSelectedSector == transportJSON) {
        chartSectorText = "TRANSPORT";
    }

    if (chartSelectedSector == electricityJSON) {
        chartSectorText = "ELECTRICITY";
    }

    if (chartSelectedSector == heatcoolJSON) {
        chartSectorText = "HEATING, COOLING";
    }
}

function addLegend(year) {

    getSectorText();

    let xPos = 100;
    let yPos = 200;

    // Add a year
    barchartTextField.append("text")
        .attr("x", xPos - 25)
        .attr("y", yPos - 70)
        .attr("text-anchor", "left")
        .attr("class", "titleText")
        .text(year);

    // Add the sector name that we selected
    barchartTextField.append("text")
        .attr("x", xPos - 23)
        .attr("y", yPos - 35)
        .attr("text-anchor", "left")
        .attr("class", "chartSectorText")
        .text(chartSectorText);

    var ordinal = d3.scaleOrdinal()
        .domain(["% non-renewable energy", "% renewable energy"])
        .range([ "rgb(204,204,204)", "rgb(51,102,51)" ]);

    barchartTextField.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (xPos - 13) + "," + yPos + ")");

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
        .shapePadding(10)
        .scale(ordinal);

    barchartTextField.select(".legendOrdinal")
        .call(legendOrdinal);
}

function updateLegend() {

    getSectorText();

    barchartTextField.selectAll(".titleText")
      .text(chartSelectedYear)

    barchartTextField.selectAll(".chartSectorText")
      .text(chartSectorText)

}

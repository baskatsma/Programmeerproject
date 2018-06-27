/*
 *  Programmeerproject
 *  barchart.js
 *
 *  Creates stacked bar chart and updates it based on the chosen year and sector.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 *  Based on: https://bl.ocks.org/mbostock/3886394
 *
 */

// Define global variables, dimensions and settings
var grossFinalJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var transportJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_TRANSPORT.json";
var electricityJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_ELECTRICITY.json";
var heatcoolJSON = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_HEAT_COOL.json";

var chartWidth;
var chartHeight;
var chartTitleMargin = 85;
var chartMargin = {top: 20, right: 300, bottom: 120, left: 73};
var chartSelectedSector = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var chartSelectedYear = 2007;
var chartSectorText;

var sortSelectionValue = "percentage";

// Define X axis properties
var chartX = d3.scaleBand()
    .paddingInner(0.0175)
    .align(0.1);

// Define Y axis properties
var chartY = d3.scaleLinear();

// Define Z axis (series)
var chartZ = d3.scaleOrdinal()
    .range(["#006600", "#cccccc"]);

var xAxisBar;

// Initialize stack
var stack = d3.stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

var barchart;
var barchartTextField;

// Initialize barchart tooltip
var barTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "barTooltip")
    .offset([-10, 115])
    .html(function(d) {
        return "Energy usage: " + "<strong>" + formatDecimal((d[1]-d[0]) * 100) + "%" + "</strong>";
    });

function makeChart(chartSelectedSector) {

    // Update chart based on screen width/height
    chartWidth = w * 0.775;
    chartHeight = (h * 0.85) - 220;

    // Update rangeRounds to X and Y
    chartX.rangeRound([0, chartWidth])
    chartY.rangeRound([chartHeight, 0]);

    // Call X axis
    xAxisBar = d3.axisBottom(chartX);

    // Add year slider
    addSlider();

    d3.json(chartSelectedSector, function(error, data) {

        if (error) throw error;

        // Append measurements to the chart and create SVG
        barchart = d3.select(".barchart")
          .append("svg")
          .attr("height", chartHeight + chartMargin.bottom)
          .attr("width", chartWidth + chartMargin.right)
          g = barchart.append("g")
            .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        // Format and calculate data
        data.forEach(function(d) {
            d.totalEnergyPercentage = 100;
            d.greenEnergyPercentage = Number(d[chartSelectedYear]);

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
              .attr("fill", d => chartZ(d.key));

        // Call tooltip
        barchart.call(barTip);

        // Append rects for each country
        serie.selectAll("rect")
          .data(d => d)
          .enter().append("rect")
            .attr("x", d => chartX(d.data.GEO_TIME))
            .attr("y", d => chartY(d[1]))
            .attr("height", d => chartY(d[0]) - chartY(d[1]))
            .attr("width", chartX.bandwidth())

          // Add effects on mouseover/-out and add d3-tip functionality
          .on("mouseover", function(d) {

              // Update tooltip based on the green/grey bar
              let selectedBar = d3.select(this);
              let barColor = d3.rgb(selectedBar.style("fill"));
              updateBarTooltip(barColor);

              d3.select(this).style("opacity", 0.7);
              barTip.show(d); })

          .on("mouseout", function(d) {
              d3.select(this).style("opacity", 1);
              barTip.hide(d); });

        // Add X-axis to the bar chart
        g.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + chartHeight + ")")
          .call(xAxisBar)
          .selectAll("text")
          .attr("transform", "rotate(45)")
          .attr("text-anchor", "start");

        // Add Y-axis to the bar chart
        g.append("g")
          .attr("class", "yAxis")
          .call(d3.axisLeft(chartY).ticks(10, "%"));

        // Create new SVG for the title and description
        barchartTextField = d3.select("#barchartTextDiv")
          .append("svg")
          .attr("height", 135 + chartMargin.bottom)
          .attr("width", 115 + chartMargin.right)
          g = barchartTextField.append("g")
            .attr("transform", "translate(" + "0" + "," + chartMargin.top + ")");

        // Create first legend instance
        addLegend(chartSelectedYear);

        });
}

function updateChart(chartSelectedSector, chartSelectedYear) {

    // Load new data
    d3.json(chartSelectedSector, function(error, data) {

        if (error) throw error;

        // Update and calculate data
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

        // Define sort
        if (sortSelectionValue == "percentage") {

            // Sort from highest green energy to lowest
            data.sort((a, b) => b.greenEnergyPercentage-a.greenEnergyPercentage);

        } else {

            // Sort alphabetically
            data.sort((a, b) => d3.ascending(a.GEO_TIME, b.GEO_TIME));
        }

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

function updateBarTooltip(barColor) {

    // Check if the color is grey (non-renewable energy) (rgb is all 204)
    if (barColor.r == 204) {

        barTip.html(function(d) {
            return "<strong>" + formatDecimal((d[1]-d[0]) * 100) + "%" + "</strong>" + " of the used energy in this sector" + "<br>" + "comes from non-renewable resources :(";
        });

    // It must be green (renewable energy)
    } else {

        barTip.html(function(d) {
            return "<strong>" + formatDecimal((d[1]-d[0]) * 100) + "%" + "</strong>" + " of the used energy in this sector" + "<br>" + "comes from renewable resources :)";
        });
    }
}

function addSlider() {

    // Define slider settings
    var yearSlider = d3.sliderHorizontal()
      .min(2007)
      .max(2016)
      .step(1)
      .width(440)
      .tickFormat(d3.format(""))
      .on("onchange", val => {
          // Update map and barchart on slider change
          chartSelectedYear = val;
          updateChart(chartSelectedSector, chartSelectedYear);
          updateMap(chartSelectedYear); });

    // Append slider element to the SVG and call it
    var g = d3.select("#slider").append("svg")
      .attr("class", "slider")
      .attr("width", 600)
      .attr("height", 55)
      .append("g")
      .attr("transform", "translate(50,15)")
      .call(yearSlider);
}

function getSectorText() {

    // Define text that gets displayed
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

    // Update sector text
    getSectorText();

    // Define position of the legend
    let xPos = 28;
    let yPos = 200;

    // Add a year
    barchartTextField.append("text")
      .attr("y", yPos - 70)
      .attr("text-anchor", "left")
      .attr("class", "titleText")
      .text(year);

    // Add the sector name that we selected
    barchartTextField.append("text")
      .attr("x", xPos - 26)
      .attr("y", yPos - 35)
      .attr("text-anchor", "left")
      .attr("class", "chartSectorText")
      .text(chartSectorText);

    // Define legend text and color
    var ordinal = d3.scaleOrdinal()
        .domain(["% non-renewable energy", "% renewable energy"])
        .range([ "rgb(204,204,204)", "rgb(51,102,51)" ]);

    // Append g element to hold the year/text
    barchartTextField.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(" + (xPos - 16) + "," + yPos + ")");

    // Define legend settings
    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
        .shapePadding(10)
        .scale(ordinal);

    // Call it
    barchartTextField.select(".legendOrdinal")
      .call(legendOrdinal);
}

function updateLegend() {

    // Update sector text
    getSectorText();

    barchartTextField.select(".titleText")
      .text(chartSelectedYear);

    barchartTextField.select(".chartSectorText")
      .text(chartSectorText);

}

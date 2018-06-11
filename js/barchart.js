/*
 *  barchart.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: https://bl.ocks.org/mbostock/3886394

// Define global variables, dimensions and settings
var formatThousand = d3.format(",")

var finalShare;
var electricityShare;
var transportShare;
var heatcoolShare;

var chartSelectedYear = 2016;

var chartWidth = 630;
var chartHeight = 540;
var titleMargin = 85;
var margin = {top: 20, right: 60, bottom: 80, left: 40};

// Is goed!
var x = d3.scaleBand()
    .range([0, chartWidth])
    .round(true)
    .padding(0.125)
    .align(0.1);

// Is goed!
var y = d3.scaleLinear()
    .rangeRound([chartHeight, 0]);

// Is goed!
var z = d3.scaleOrdinal()
    .range(["#009999", "#DCDCDC"]);

var stack = d3.stack()
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // var data3 = d3.range(0, 10).map(function (d) { return new Date(2007 + d, 10, 3); });
    //
    // var slider3 = d3.sliderHorizontal()
    //   .min(d3.min(data3))
    //   .max(d3.max(data3))
    //   .step(1000 * 60 * 60 * 24 * 365)
    //   .width(400)
    //   .tickFormat(d3.timeFormat('%Y'))
    //   .tickValues(data3)
    //   .on('onchange', val => {
    //     console.log(val);
    //     d3.select("p#value3").text(d3.timeFormat('%Y')(val));
    //   });
    //
    // var g = d3.select("div#slider3").append("svg")
    //   .attr("width", 500)
    //   .attr("height", 65)
    //   .append("g")
    //   .attr("transform", "translate(30,30)");
    //
    // g.call(slider3);
    //
    // d3.select("p#value3").text(d3.timeFormat('%Y')(slider3.value()));
    // d3.select("a#setValue3").on("click", () => slider3.value(new Date(1997, 11, 17)));

    // d3.queue()
    //     .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json")
    //     .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_TRANSPORT.json")
    //     .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_ELECTRICITY.json")
    //     .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_HEAT_COOL.json")
    //     .await(mainCode);

    d3.json("data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json", function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        // Append measurements to the chart
        var barchart = d3.select(".barchart")
            .append("svg")
            .attr("height", chartHeight + 40)
            .attr("width", chartWidth + 50)
            g = barchart.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dataStorage = {};
        var year = chartSelectedYear;

        data.forEach(function(d) {
            dataStorage[d.GEO] = d[year];
            d.greenEnergyPercentage = Number(d[year]);

            if (d.greenEnergyPercentage >= 100) {
                d.greenEnergyPercentage = 100;
            }

            d.totalEnergyPercentage = 100;
            d.greyEnergyPercentage = d.totalEnergyPercentage - d.greenEnergyPercentage;
        });

        // Sort from highest green energy to lowest
        data.sort(function(a, b) { return b.greenEnergyPercentage-a.greenEnergyPercentage; });

        x.domain(data.map(function(d) { return d.GEO; }));
        z.domain(["greenEnergyPercentage", "greyEnergyPercentage"]);

        var serie = g.selectAll(".serie")
            .data(stack.keys(["greenEnergyPercentage","greyEnergyPercentage"])(data))
            .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function(d) { return z(d.key); });

        serie.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.GEO); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "%"));
        //
        // document.getElementById("barchartTitle").innerHTML = chartSelectedYear;
        // // chosenState.bold() + " population, " + "2010 to 2016"

        var ordinal = d3.scaleOrdinal()
            .domain(["% non-renewable energy", "% renewable energy"])
            .range([ "rgb(220, 220, 220)", "rgb(0, 153, 153)" ]);

        barchart.append("g")
          .attr("class", "legendOrdinal")
          .attr("transform", "translate(440, 140)");

        var legendOrdinal = d3.legendColor()
          .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
          .shapePadding(10)
          .scale(ordinal);

        barchart.select(".legendOrdinal")
          .call(legendOrdinal);

        // Add a year
        barchart.append("text")
            .attr("x", chartWidth/1.575)
            .attr("y", titleMargin + 30)
            .attr("text-anchor", "left")
            .attr("class", "titleText")
            .text(chartSelectedYear);

        });

});

function mainCode(error, data) {

    // Initialize the map with the successfully loaded data
    if (error) throw error;

}

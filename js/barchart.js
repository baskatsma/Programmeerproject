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

// var europe;
var finalShare;

var selectedYear = 2016;

var width = 580;
var height = 580;
var titleMargin = 85;
var margin = {top: 20, right: 60, bottom: 30, left: 40};

function mainCode(error, finalShareData, transportShareData, electricityShareData, heatcoolShareData) {

    // Initialize the map with the successfully loaded data
    if (error) throw error;

    console.log(finalShareData);
    console.log(transportShareData);
    console.log(electricityShareData);
    console.log(heatcoolShareData);
}

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Append measurements to the chart
    var barchart = d3.select(".barchart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Is goed!
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);

    // Is goed!
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // Is goed!
    var z = d3.scaleOrdinal(d3.schemeCategory20);

    // Is goed!
    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%y"));
		var yAxis = d3.axisLeft(y);

    var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    d3.queue()
        .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json")
        .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_TRANSPORT.json")
        .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_ELECTRICITY.json")
        .defer(d3.json, "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_HEAT_COOL.json")
        .await(mainCode);

    // d3.json("data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json", function(error, finalShareData) {
    //
    //     // Log any errors, and save results for usage outside of this function
    //     if (error) throw error;
    //
    //     finalShare = finalShareData;
    //     console.log(finalShare);
    //
    //     // Extract the EUROSTAT data
    //     data = {};
    //     year = selectedYear;
    //     finalShareData.forEach(function(d) {
    //         data[d.GEO] = d[year];
    //     });
    //
    //     // data.forEach(function(d){d.totalEnergy=d.totalHours-d.leftHours});
    //     // data.sort(function(a, b) { return b.totalHours-a.totalHours; });
    //
    // });

});

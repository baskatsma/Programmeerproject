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
// var energyUsage;

var width = 580;
var height = 580;
var titleMargin = 85;
var margin = {top: 20, right: 60, bottom: 30, left: 40};

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

    d3.json("data/ten00094_Electricity_consumption_by_industry.json", function(error, data) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        console.log(data);

        // data.forEach(function(d){d.totalEnergy=d.totalHours-d.leftHours});
        // data.sort(function(a, b) { return b.totalHours-a.totalHours; });

    });

    // d3.csv("data/ten00094_Electricity_consumption_by_industry.csv", type, function(error, data) {
    //
    //     if (error) throw error;
    //
    //     data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });
    //
    //     x.domain(data.map(function(d) { return d.GEO; }));
    //     z.domain(data.columns.slice(1));
    //
    //     var serie = barchart.selectAll(".serie")
    //       .data(stack.keys(data.columns.slice(1))(data))
    //       .enter().append("g")
    //         .attr("class", "serie")
    //         .attr("fill", function(d) { return z(d.key); });
    //
    //     serie.selectAll("rect")
    //       .data(function(d) { return d; })
    //       .enter().append("rect")
    //         .attr("x", function(d) { return x(d.data.GEO); })
    //         .attr("y", function(d) { return y(d[1]); })
    //         .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    //         .attr("width", x.bandwidth());
    //
    //     barchart.append("g")
    //         .attr("class", "axis axis--x")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(xAxis);
    //
    //     barchart.append("g")
    //         .attr("class", "axis axis--y")
    //         .call(yAxis.ticks(10, "%"));
    //
    //     var legend = serie.append("g")
    //         .attr("class", "legend")
    //         .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.GEO) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });
    //
    //     legend.append("line")
    //         .attr("x1", -6)
    //         .attr("x2", 6)
    //         .attr("stroke", "#000");
    //
    //     legend.append("text")
    //         .attr("x", 9)
    //         .attr("dy", "0.35em")
    //         .attr("fill", "#000")
    //         .style("font", "10px sans-serif")
    //         .text(function(d) { return d.key; });
    //
    // });

    // d3.csv("data/ten00094_Electricity_consumption_by_industry.csv", function(d, i, columns) {
    //     for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    //     d.total = t;
    //     console.log(t);
    //     return d;
    //   }, function(error, data) {
    //
    //         // Log any errors, and save results for usage outside of this function
    //         if (error) throw error;
    // });

});

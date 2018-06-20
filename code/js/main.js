/*
 *  main.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Define global variables, dimensions and settings
var parseDate = d3.timeParse("%Y");
var formatThousand = d3.format(",");
var formatDecimal = d3.format(".1f");
var formatThousandDecimal = d3.format(",.1f");

// Set default map
var mapSelectedYear = "2016";

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Load map of Europe
    makeMap(mapSelectedYear);

    // Load default line chart
    makeLineGraph("NL");

    // Listen to button changes
    inputListener();

});

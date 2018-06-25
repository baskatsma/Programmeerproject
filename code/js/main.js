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

var h;
var w;

// Set default values for visualisations
var defaultSector = "data/nrg_ind_335a_Share_of_energy_from_renewable_sources_GROSS_FINAL.json";
var defaultYear = "2007";
var defaultCountry = "NL";

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Grab window dimensions
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;

    // Load default chart
    makeChart(defaultSector);

    // Load map of Europe
    makeMap(defaultYear);

    // Load default line chart
    makeLineGraph(defaultCountry);

    // Listen to button changes
    interactivityListeners();

});

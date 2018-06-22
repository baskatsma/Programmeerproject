/*
 *  interactivity.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Code is optimized!
// Flip on hover function
// $(function(){
//     $("#card").flip({
//         trigger: 'hover',
//         reverse: true
//     });
// });

// Code is optimized!
// Flip on click function
// $(function(){
//     $("#card").flip({
//         trigger: 'click',
//     });
// });

function interactivityListeners() {

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

      console.log("sector dropdown used", dropdownSelection, chartSelectedSector, chartSelectedYear);

      updateChart(chartSelectedSector, chartSelectedYear);
  });

  // Add an event listener for the sort selection buttons
  $("input[name=sortSelection]").change(function() {

      sortSelectionValue = $(this).val();

      console.log("radio button pressed", sortSelectionValue, chartSelectedYear, chartSelectedSector);

      updateChart(chartSelectedSector, chartSelectedYear);
  });

  // Add an event listener for the sector buttons
  $(".btn-sm").on("click", function(event) {

      // Don't follow href
      event.preventDefault();

      energySelection = $(this).text();

      if (energySelection == "Total") {
          lineSelectedSector = totalProductionJSON;
      }

      if (energySelection == "Hydro") {
          lineSelectedSector = hydroProductionJSON;
      }

      if (energySelection == "Wind") {
          lineSelectedSector = windProductionJSON;
      }

      if (energySelection == "Solar") {
          lineSelectedSector = solarProductionJSON;
      }

      console.log("sector button pressed", energySelection, lineSelectedSector, currentGEO);

      updateLines(lineSelectedSector, currentGEO);

  });

}

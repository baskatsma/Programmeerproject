/*
 *  Programmeerproject
 *  interactivity.js
 *
 *  Enables button functionality based on click events.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

function interactivityListeners() {

  // Add an event listener for the popover description button
  $('[data-toggle="popover"]').on("click", function(event) {

      // Prevent skipping to top of page
      event.preventDefault();

      })
  .popover({
      // Allow the user to press anywhere to disable the pop-up
      trigger: "focus"
  });

  // Add an event listener for the year selector button
  $(".dropdown-item").on("click", function(event) {

      // Prevent skipping to top of page
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

      updateChart(chartSelectedSector, chartSelectedYear);
  });

  // Add an event listener for the sort selection buttons
  $("input[name=sortSelection]").change(function() {

      // Extract value of radio button and update chart
      sortSelectionValue = $(this).val();
      updateChart(chartSelectedSector, chartSelectedYear);
  });

  // Add an event listener for the sector buttons
  $(".btn-sm").on("click", function(event) {

      // Prevent skipping to top of page
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

      updateLines(lineSelectedSector, currentGEO);
  });
}

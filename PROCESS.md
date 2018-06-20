## Europe: Life in \#008000
#### Bas Katsma - Programmeerproject
This project visualizes the *standard* and *renewable* energy usage and production in Europe.

## day 4 (Thu 7 Jun)
I built a map of Europe with a button to change the year, using my old US map
framework. The data from EUROSTAT was easy to work with; I found a tutorial online
that used D3 and EUROSTAT data, so I followed that. I did encounter a problem,
though: the ID tags of Greece and some other countries did not match in the
topoJSON & EUROSTAT file, so I had to manually rename some tags inside the
europe.json file. Also, it was quite tough to correctly update the map, because initially I was unable to access the svg element outside of the main code.

## day 5 (Fri 8 Jun)
I received helpful feedback. There's no need for the interactivity (year selection) of the map anymore, because I already have enough elements I want to implement.
Thus, that part was removed and the previously missing legend is implemented.
Also, prepared the data for the normalized radial stacked bar graph.

## day 6 (Mon 11 Jun)
Today we started with the stand-up, where we discussed our plans for the week.
- My goal for today was to create visualisation 2; a normalized stacked bar graph (not radial anymore, because radials are "bad" if you want to quickly glance at the visualisation).
- The datasets for visualisation 2 contained numbers that were not integers (e.g. 5,5; 12,4; 13,5, etc.), which were separated by a comma. For visualisation 1, all numbers were integers.
- As a result, I got a lot of NaN errors and quickly figured out that I had to replace all comma's with '.''s --> problem solved!
- I struggled a lot with the way I wanted the stacked bar graph to look like. Ultimately,
I decided to display all countries on the X-axis, and use a year-slider to control the years. A dropdown menu will still allow one to change the sector.
- To do: add tooltip for the barchart, add dropdown menu to change sector in which the energy is used, add year slider, add update mechanism, add animations.

## day 7 (Tue 12 Jun)
Today we started with the stand-up, where we discussed our progress since Monday. I did pretty well (imo), because I got quite far with visualisation 2.
- My goal for today was to add a tooltip, a dropdown menu, and the update mechanism to change sector for visualisation 2.
- Result: it took me a lot of time, but in the end I made it.

## day 8 (Wed 13 Jun)
Today we started with the stand-up, where we discussed the style guide.
- My goal for today: year slider for visualisation 2 and preparation of all data sets for visualisation 3.
- Result: I found it quite hard to find a good-looking (and functioning) slider for d3 v4, so I settled for a decent-looking one and tweaked its appearance a LOT. Data sets were not hard to prepare, because they were from EUROSTAT.

## day 9 (Thu 14 Jun)
Today we started with the stand-up, where we discussed the style guide (again).
- Re-did my datasets, because it was not working with the line graph.
- Plotted all countries on the line graph.

## day 10 (Fri 15 Jun)
I received helpful feedback during the presentation. I might edit the map data and show
energy usage per capita instead of per whole country, because that could also be interesting!

## day 11 (Mon 18 Jun)
- Added a zoom function to visualisation 3 to improve visibility.
- Decided to show ALL the countries at once, which makes it way more easy to compare.
- Decided to NOT add the dual axis thing with another line (electricity prices), because it impairs the visibility way too much.
- Began to link the map to the line chart.
- Decided to show the graph of the Netherlands if a country has no valid data (mostly non-EU countries), to really show everyone how bad we are doing :(.

## day 12 (Tue 19 Jun)
- Struggled a lot with interactivity between map & line chart, primarily with updating the data and transitioning. Worked out in the end after a few hours.
- Plan for tomorrow: finish all interactivity

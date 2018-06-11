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

Oant moarn, Bas.

## day 5 (Fri 8 Jun)
I received helpful feedback. There's no need for the interactivity (year selection) of the map anymore, because I already have enough elements I want to implement.
Thus, that part was removed and the previously missing legend is implemented.
Also, prepared the data for the normalized radial stacked bar graph.

Oant moarn, Bas.

## day 8 (Mon 11 Jun)
Today we started with the stand-up, where we discussed our plans for the week.
- My goal for today was to create visualisation 2; a normalized stacked bar graph (not radial anymore, because radials are "bad" if you want to quickly glance at the visualisation).
- The datasets for visualisation 2 contained numbers that were not integers (e.g. 5,5; 12,4; 13,5, etc.), which were separated by a comma. For visualisation 1, all numbers were integers.
- As a result, I got a lot of NaN errors and quickly figured out that I had to replace all comma's with '.''s --> problem solved!
- I struggled a lot with the way I wanted the stacked bar graph to look like. Ultimately,
I decided to display all countries on the X-axis, and use a year-slider to control the years. A dropdown menu will still allow one to change the sector.
- To do: add tooltip for the barchart, add dropdown menu to change sector in which the energy is used, add year slider, add update mechanism, add animations.

Oant moarn, Bas.

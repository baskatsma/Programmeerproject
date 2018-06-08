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
Thus, that part was removed and now I will focus on adding a legend (that one is
still missing).

Oant moarn, Bas.

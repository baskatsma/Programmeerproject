# Programmeerproject

## A More \#008000 Europe
#### Bas Katsma
This project visualizes the *standard* and *renewable* energy usage and production in Europe.

## Problem statement
#### Write a statement about the problem that your finished product will solve. The problem has to be clearly described and very specific.
De koolcentrales zijn we massaal aan het sluiten in Nederland. In de Noordzee manifesteren zich grote hoeveelheden windparken, met nog velen op de planning. Maar, hoe zit dit op Europese schaal? Hoe is het energieverbruik en de -productie als we dit onder de loep nemen? En door de jaren heen? Staat ons kleine kikkerlandje er überhaupt wel goed voor?

Het gefinishte product laat duidelijk zien hoe het "grijze" en groene energieverbruik, de energieprijs en de productie van *renewable* energie per Europees land door de jaren heen zich onderling verhouden. Op dit moment is dat namelijk nog niet te zien.
#### You should be able to define a target audience who have specific interests that match your project. Include that, too.
De *target audience* van dit project zijn de milieu- en/of prijsbewuste individuen. Deze willen bijvoorbeeld weten hoe goed een land presteert op basis van de productie of verbruik van groene energie.

## Solution
#### Summarize your idea in a single sentence, connecting it to the “gap” that you describe.
#### Include a visual sketch of what the final product will look like for the user.
Zie **doc**.
#### List of main features that will be available to users. All features should also be visible in the sketch. Keep it brief.
- Een landkaart van Europa met het totale energieverbruik per land. Dropdown: selectie van jaar. Hover: laat het jaartal, land en verbruik zien.
- Een radiale genormaliseerde stacked bar graph met het percentage groene/grijze energieverbruik per land. Dropdown: selectie van jaar. Hover: laat het jaartal, land en percentage groene/grijze energieverbruik zien.
- Een multi-line dual axis graph met de energieprijs en de productie van *renewable* energie per land per jaartal. Dropdown: selectie van land. Hover: laat het jaartal, land, energieprijs en "groene" productie zien.
#### Mark which features define the minimum viable product (MVP) and which parts may be optional to implement.
- Alles is het MVP, met uitzondering van het dual axis aspect. Als dat niet lukt, valt alleen de energieprijs te zien (1 Y-axis).

## Prerequisites
#### Data sources
- [Full database](http://ec.europa.eu/eurostat/web/energy/data/database)
- [Main tables](http://ec.europa.eu/eurostat/web/energy/data/main-tables)
#### External components
- [Bootstrap 4.1.1](http://getbootstrap.com)
- [d3-tip compatible with d3.js v4](https://github.com/VACLab/d3-tip)
- [Google Fonts](https://fonts.google.com)
#### Review of similar or related visualizations

#### Hardest parts of implementing the visualizations

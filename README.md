## Europe: Life in \#008000
#### Bas Katsma - Programmeerproject
This project visualizes the *standard* and *renewable* energy usage and production in Europe.

## Problem statement
De koolcentrales zijn we massaal aan het sluiten in Nederland. In de Noordzee manifesteren zich grote hoeveelheden windparken, met nog velen op de planning. Maar, hoe zit dit op Europese schaal? Hoe is het energieverbruik en de -productie als we dit onder de loep nemen? En door de jaren heen? Staat ons kleine kikkerlandje er überhaupt wel goed voor?

De *target audience* van dit project zijn de milieubewuste individuen. Deze willen bijvoorbeeld weten hoe goed een land presteert op basis van de productie of verbruik van groene energie.

## Solution
Het gefinishte product laat duidelijk zien hoe het "grijze" en groene energieverbruik, de energieprijs en de productie van *renewable* energie per Europees land door de jaren heen zich onderling verhouden. Op dit moment is dat namelijk nog niet te zien.

#### Visual sketch
![Sketch](https://github.com/baskatsma/Programmeerproject/blob/master/doc/sketches_v3.png)

#### Main features
- Een landkaart van Europa met het totale energieverbruik per land (color-coded naarmate van hoeveelheid).
**Dropdown**: selectie van jaar.
**Hover**: laat het jaartal, land en verbruik zien.
**Click**: laadt de radiale genormaliseerde stacked bar graph van dit land en de multi-line dual axis graph met het aangeklikte land als gekozen onderwerp.

- Een radiale genormaliseerde stacked bar graph met het percentage groene/grijze energieverbruik per jaar.
**Dropdown**: selectie van categorie (transport, heating & cooling, etc.) in energieverbruik.
**Hover**: laat het jaartal, land en percentage groene/grijze energieverbruik zien.

- Een multi-line dual axis graph met de elektriciteitsprijs en de productie van *renewable* energie per land per jaartal.
**Dropdown**: selectie van soort renewable energie (bv. windenergie, zonne-energie, hydro-energie of totaal).
**Hover**: laat het jaartal, land, energieprijs en "groene" productie zien.

- Alles is het MVP, met uitzondering van het dual axis aspect. Als dat niet lukt, valt alleen de energieprijs te zien (1 Y-axis).

## Prerequisites
#### Data sources
- [EUROSTAT - Full database](http://ec.europa.eu/eurostat/web/energy/data/database)
- [EUROSTAT - Main tables](http://ec.europa.eu/eurostat/web/energy/data/main-tables)
- Voor beide sources: geen transformaties nodig.

#### External components
- [d3 v4](https://d3js.org)
- [Bootstrap 4.1.1](http://getbootstrap.com)
- [d3-tip compatible with d3.js v4](https://github.com/VACLab/d3-tip)
- [topoJSON](https://github.com/topojson/topojson)
- [d3-queue](https://github.com/d3/d3-queue)
- [Google Fonts](https://fonts.google.com)

#### Review of similar or related visualizations
- **Map**: heb ik in het verleden ook al gemaakt (kaart van alle Amerikaanse staten). Challenge: als de backbone van de Europese kaart **niet hetzelfde** is. Hiervoor zal ik dan veel voorbeelden moeten opzoeken die gebruik maken van Europese files.
- **Radiale genormaliseerde stacked bar graph**: dit is volledig nieuw voor mij. Ik ga voorbeelden doornemen die in d3.js v4 zijn geschreven en proberen te ontcijferen hoe alles werkt.
- **Multi-line dual axis graph**: het dual Y-axis aspect is nieuw voor mij. Ik ga voorbeelden doornemen die in d3.js v4 zijn geschreven en proberen te ontcijferen hoe alles werkt.

#### Hardest parts of implementing the visualizations
- Correcte datastructuur uitvinden! Dit zal heel ingewikkeld worden. Vereist veel goede beslissingen voorafgaand aan het maken van de visualisaties.
- Het uitvogelen van de technische structuur en het implementeren van de radiale genormaliseerde stacked bar graph zal zeer zeker een ingewikkeld proces worden/zijn.


## Link
- https://baskatsma.github.io/Programmeerproject/index.html

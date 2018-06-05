## Europe: Life in \#008000
#### Bas Katsma - Programmeerproject
This project visualizes the *standard* and *renewable* energy usage and production in Europe.

## Data sources

Op 1 uitzondering na is de data in een .xls format. Dit moet dus eerst via Excel/Numbers worden geconverteerd naar .csv, waarna het kan worden gebruikt.
De uitzondering is in een .tsv format; wat bijna gelijk is aan .csv (tabs i.p.v. komma's). Die tabs moeten dus nog worden omgezet.

Ik wil voor elke visualisatie een eigen databestand, om het niet te ingewikkeld te maken qua structuur. Daarna wil ik per land (row) de values per jaartal (column).

#### Final energy consumption by product
- [EUROSTAT - Final energy consumption by product](http://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=ten00095&language=en)

#### Share of energy from renewable sources
- [EUROSTAT - Share of energy from renewable sources](http://appsso.eurostat.ec.europa.eu/nui/submitViewTableAction.do)

#### Electricity prices by type of user
- [EUROSTAT - Electricity prices by type of user](http://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=ten00117&language=en)

#### Primary production of renewable energy by type
- [EUROSTAT - Primary production of renewable energy by type](http://ec.europa.eu/eurostat/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=ten00081&language=en)

## Diagram with an overview of the technical components
![Diagram](https://github.com/baskatsma/Programmeerproject/blob/master/doc/diagram_v1.png)

## Descriptions of each of the components and what you need to implement these
- Met topoJSON en een projectie van Europa kan er een landkaart van Europa worden gemaakt, die het totale energieverbruik per land (color-coded naarmate van hoeveelheid) visualiseert.
**Dropdown**: selectie van jaar, middels een Bootstrap button.
**Hover**: laat het jaartal, land en verbruik zien, middels d3-tip.
**Click**: laadt de radiale genormaliseerde stacked bar graph van dit land en de multi-line dual axis graph met het aangeklikte land als gekozen onderwerp.
**What I need to implement this**: d3 v4, Bootstrap 4.1.1, topoJSON, projection of Europe, d3-tip.

- Een radiale genormaliseerde stacked bar graph met het percentage groene/grijze energieverbruik per jaar.
**Dropdown**: selectie van categorie (transport, heating & cooling, etc.) in energieverbruik, middels een Bootstrap button.
**Hover**: laat het jaartal, land en percentage groene/grijze energieverbruik zien, middels d3-tip.
**What I need to implement this**: d3 v4, Bootstrap 4.1.1, d3-tip.

- Een multi-line dual axis graph met de elektriciteitsprijs en de productie van *renewable* energie per land per jaartal.
**Dropdown**: selectie van soort renewable energie (bv. windenergie, zonne-energie, hydro-energie of totaal), middels een Bootstrap button.
**Hover**: laat het jaartal, land, energieprijs en "groene" productie zien, middels d3-tip.
**What I need to implement this**: d3 v4, Bootstrap 4.1.1, d3-tip.

## List of (D3) plugins
- [d3 v4](https://d3js.org)
- [Bootstrap 4.1.1](http://getbootstrap.com)
- [d3-tip compatible with d3.js v4](https://github.com/VACLab/d3-tip)
- [topoJSON](https://github.com/topojson/topojson)
- [d3-queue](https://github.com/d3/d3-queue)

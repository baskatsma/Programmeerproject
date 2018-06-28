# Europe: Life in \#008000
### Programmeerproject 2018
**Naam**: Bas Katsma. \
**Studentnummer**: 10787690.

## REPORT.MD
![frontpage](docs/frontpage.png)

### Korte uitleg
**Europe: Life in \#008000** geeft de geïnteresseerden de mogelijkheid om in meer detail naar het Europese energieverbruik en de -productie te kijken. 
- De bar chart geeft in één oogopslag het percentage gebruikte "groene" en "grijze" energie per sector en per jaar weer
- De interactieve map biedt het totale energieverbruik via kleurcoderingen aan
- De multi-series line chart laat per categorie 'hernieuwbare grondstof' de opwek van energie zien

### Technische design

#### Overview
De index.html van mijn project staat in /project/ en laadt de benodigde JavaScript bestanden, CSS bestanden, en fonts in. Het hele thema van mijn website is gebaseerd op het Grayscale thema van Start Bootstrap. Deze heeft zijn eigen folder in /project/bootstrap/. Hierin zit onder andere een grayscale.css file, die de website algemeen stylet. Daarnaast heb ik nog per visualisatie een eigen .css file, om zo specifieke onderdelen te targetten en deze regels weer makkelijk terug te vinden.

Er wordt gebruik gemaakt van een "centrale" JavaScript file (**main.js**), die voor alle aansturing zorgt nadat de _DOM content_ is geladen. Main.js start het opvragen van de afmetingen van de browser window, waarna het drie functies aanroept die de volgende visualisaties maakt:
1. Stacked bar chart met als _default_ sector: gross final en _default_ jaar: 2007
2. Kaart van Europa met als _default_ jaar: 2007
3. Multi-series line chart met als _default_ land: Nederland

De **stacked bar chart** heeft drie interactieve elementen:
- _**Dropdown menu**_ om de sector te veranderen
- _**Slider**_ om het jaartal te veranderen; deze beïnvloedt tevens het jaar van de kaart van Europa
- _**Radio buttons**_ om de sortering te veranderen


Met mouseover en mouseout events wordt de tooltip — welke het % energie laat zien — respectievelijk getoond en weggehaald.

De **map/kaart van Europa** wordt enkel zelf beïnvloed door de slider van de bar chart. \
Een **on click** functie zorgt ervoor dat de multi-series line chart wordt geüpdatet: de naam van het land wordt in de titel gezet en de lijn van het land wordt gehighlight. De mouseover en mouseout events laten, net als bij de bar chart, de tooltip zien. Deze weergeeft het land en het energieverbruik gedurende dat hele jaar.

De **multi-series line chart** kan via vier knoppen (hernieuwbare energiebronnen categorieën) worden geüpdatet. Er spelen hier twee mouseover en mouseout events een rol:
1. Hover over de lijn: weergeeft de naam van het land
2. Hover over de cirkels: weergeeft de productie van groene energie

#### Detail
De functies waarmee de visualisaties daadwerkelijk worden gemaakt, staan respectievelijk in **barchart.js**, **map.js**, en **line.js**. Elk 'visualisatiesoort'.js bestand heeft twee belangrijke functies:
1. **Het maken van de initiële visualisatie** met de default waardes wanneer de website voor de eerste keer wordt geladen. Deze functienaam begint altijd met **make** \
In elke **make** functie wordt de hoogte en de breedte van de visualisatie gebaseerd op een _x_ percentage van de browser window grootte. Daarna wordt de correcte data file via een d3.json() functie ingeladen; als er twee bestanden moeten worden ingevoerd, wordt er gebruik gemaakt van d3.queue() en wordt er een extra functie aangeroepen — nadat alles succesvol is geïmporteerd — die de visualisatie daadwerkelijk maakt (functie eindigt op -**Core**). Nadat de data via json() of queue() is geladen, wordt deze omgezet en  

2. **Het updaten van de visualisatie**. \
Dit gebeurt bijvoorbeeld nadat er een verandering in de slider — bevindt zich in /project/code/js/d3-simple-slider.js — wordt gedetecteerd, of als er op een interactieve button wordt geklikt. Deze veranderingen worden gedetecteerd via jQuery event listeners in /project/code/js/interactivity.js. De waarde uit het desbetreffende interactieve element wordt dan in een globaal-toegankelijke variabele geüpdatet, en daarna wordt er een **update** functie aangeroepen die gebruik maakt van die globaal-toegankelijke variabele.

- Clearly describe the technical design: how is the functionality implemented in your code? This should be like your DESIGN.md but updated to reflect the final application. First, give a high level overview, which helps us navigate and understand the total of your code (which components are there?). Second, go into detail, and describe the modules/classes (apps) files/functions (data) and how they relate.

### Challenges
- Clearly describe challenges that your have met during development. Document all important changes that your have made with regard to your design document (from the PROCESS.md). Here, we can see how much you have learned in the past month.
- Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before? Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?

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
1. **Het maken van de initiële visualisatie** met de default waardes wanneer de website voor de eerste keer wordt geladen. Deze functienaam begint altijd met **make**. \
In elke **make** functie wordt de hoogte en de breedte van de visualisatie gebaseerd op een _x_ percentage van de browser window grootte. Daarna wordt de correcte data file via een d3.json() functie ingeladen; als er twee bestanden moeten worden ingevoerd, wordt er gebruik gemaakt van d3.queue() en wordt er een extra functie aangeroepen — nadat alles succesvol is geïmporteerd — die de visualisatie daadwerkelijk maakt (functie eindigt op -**Core**). Nadat de data via json() of queue() is geladen, wordt deze omgezet en gebruikt.

2. **Het updaten van de visualisatie**. \
Dit gebeurt bijvoorbeeld nadat er een verandering in de slider — bevindt zich in /project/code/js/d3-simple-slider.js — wordt gedetecteerd, of als er op een interactieve button wordt geklikt. Deze veranderingen worden gedetecteerd via jQuery event listeners in /project/code/js/interactivity.js. De waarde uit het desbetreffende interactieve element wordt dan in een globaal-toegankelijke variabele geüpdatet, en daarna wordt er een **update** functie aangeroepen die gebruik maakt van die globaal-toegankelijke variabele. Indien nodig, wordt er weer via d3.queue() een nieuwe dataset ingeladen en wordt deze geformatteerd en/of geprocessed, en gebruikt.

### Challenges
- Ik had in het begin veel moeite met het updaten van de stacked bar chart. Omdat het framework van een stacked bar chart er een stuk anders uit zag dan een gewone bar chart, vond ik de update functie pittig ingewikkeld. Ik kreeg de nieuwe data eerst niet gekoppeld aan de specifieke bar serie (bv. enkel de grijze of groene bar), maar uiteindelijk — na oneindig console.log'en en experimenteren — lukte het.
- Verder waren de meerdere mouseover/mouseout events van de multi-series line chart een nieuw onderdeel voor mij. Tijdens Data Processing had ik wel eens eerder meerdere lijnen gemaakt, maar die bleven tamelijk simpel qua functionaliteit. Met dit vak wilde ik dat naar een hoger niveau optillen; wat voor veel tussentijdse frustratie en migraine heeft gezorgd.

### Veranderingen door de loop van het vak heen
1. Geen dropdown menu om het jaartal te selecteren voor de map van Europa.
2. Geen radiaal-vorm meer voor de stacked bar chart.
3. Geen tweede Y-as (met de elektriciteitsprijs) in de multi-series line chart.
4. Alle Europese landen tegelijk visualiseren in de multi-series line chart i.p.v. één specifiek land, die gekozen zou worden door een on click functie in de map.
5. Radio buttons toegevoegd om de sortering van de bar chart te veranderen.

### Waarom deze veranderingen?
1. Ik had eerst deze methode geïmplementeerd, maar na feedback te hebben gekregen tijdens de wekelijkse presentaties op vrijdag bleek dit niet heel gebruiksvriendelijk. Toen had ik eerst de gehele update functie verwijderd (aangezien ik eerst al over genoeg interactieve elementen beschikte), maar later besloot ik om de slider van de bar chart de map te laten beïnvloeden, om zo ook nog voor meer interactie tussen de eerste visualisatie en de rest te creëeren.
2. Dit heb ik zo gedaan, omdat Mike Bostock in het voorbeeld dat ik wilde gebruiken zelf ook al aangaf dat dit he-le-maal niet gebruiksvriendelijk is voor visualisaties. Het ziet er esthetisch wel prima uit, maar het aflezen van de data is nogal een heftige klus dan.
3. Zie 4.
4. Het voorgaande punt heeft hier ook mee te maken. Terwijl ik bezig was met het developen van de line chart, lukte het maar niet om maar één lijn (specifieke land) uit mijn dataset te plotten; het was alles, of niets. Toen besloot ik maar om wel alle lijnen te visualiseren, maar dat zorgde weer voor een nieuw probleem: heel veel Europese landen hingen onderin en gingen allemaal over elkaar heen. Om dit probleem op te lossen, heb ik er voor gekozen om een zoom functie te implementeren: hiermee kun je een aardig stukje inzoomen om zo toch nog onderscheid te kunnen maken tussen alle landen die onderin geclusterd zijn. Nadat dat was gelukt, werkte het al een stuk gebruiksvriendelijker en vond ik de oplossingen die ik had gecreëerd goed genoeg. Het zou echter een stuk chaotischer worden al had ik besloten om TOCH nog de tweede Y-as en een extra lijn toe te voegen, dus liet ik dat plan maar achterwege.
5. Dit maakt het veel makkelijker om de statistieken van een specifiek land te volgen. Er zitten geen nadelen aan, omdat het _default_ sorteermechanisme hetzelfde is gebleven. De gebruiker merkt dus niks, tenzij er specifiek op een andere sorteerknop wordt geklikt.

### In een ideale wereld...
3. Is onderdeel van het antwoord op punt 4.
4. Hier zou ik misschien toch nog wel een andere oplossing voor hebben bedacht. Misschien dat een stacked bar chart een betere oplossing zou zijn geweest om de productie van energie middels hernieuwbare energiebronnen te visualiseren. Dan heeft ieder land genoeg ruimte en overlappen ze elkaar niet. Wellicht dat de huidige stacked bar chart dan de line chart zou kunnen worden: twee lijnen (grijs en groen energieverbruik), met de Y-as weer van 0 tot 100%, en dan door de jaren heen. Dan kan het dropdown menu ook gewoon worden bewaard, om zo te switchen tussen de sectoren. Aangezien er dan maar twee lijnen visible zijn in de grafiek, is het zelfs mogelijk om ditmaal wél een tweede Y-as toe (en de lijn voor elektriciteitsprijs) te voegen zonder dat het chaotisch druk wordt.

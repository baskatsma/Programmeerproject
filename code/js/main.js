/*
 *  main.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Define global variables, dimensions and settings
var parseDate = d3.timeParse("%Y");
var formatThousand = d3.format(",");
var formatDecimal = d3.format(".1f");
var formatThousandDecimal = d3.format(",.1f");

// Set default map
var mapSelectedYear = "2016";

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Load map of Europe
    makeMap(mapSelectedYear);

    // Load default line chart
    makeLineGraph("NL");

    // Listen to button changes
    inputListener();

    //
    var element = document.getElementById("animatedTextRow");
    var elements = document.getElementsByClassName("txt-rotate");
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-rotate");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);

});

// https://speckyboy.com/css-javascript-text-animation-snippets/
var TxtRotate = function(element, toRotate, period) {
    this.toRotate = toRotate;
    this.element = element;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
   var i = this.loopNum % this.toRotate.length;
   var fullTxt = this.toRotate[i];

   if (this.isDeleting) {
     this.txt = fullTxt.substring(0, this.txt.length - 1);
   } else {
     this.txt = fullTxt.substring(0, this.txt.length + 1);
   }

   this.element.innerHTML = '<span class="wrap">'+this.txt+'</span>';

   var that = this;
   var delta = 225 - Math.random() * 100;

   if (this.isDeleting) { delta /= 2; }

   if (!this.isDeleting && this.txt === fullTxt) {
     delta = this.period;
     this.isDeleting = true;
   } else if (this.isDeleting && this.txt === '') {
     this.isDeleting = false;
     this.loopNum++;
     delta = 500;
     console.log(this.loopNum)
   }

   setTimeout(function() {
     that.tick();
   }, delta);
 };

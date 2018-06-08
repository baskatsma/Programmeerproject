/*
 *  index.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Code is optimized!
// https://stackoverflow.com/a/41698614
function isVisible(element) {
    if (!(element instanceof Element)) throw Error('DomUtil: element is not an element.');
    const style = getComputedStyle(element);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
}

// Code is optimized!
// Toggle function
$(function() {
    $( "#continueButton" ).click(function() {
        $( "#animatedText" ).fadeToggle();
        // var element = document.getElementById("animatedText");
        // var visibility = isVisible(element);
        // console.log(visibility);
    });
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

// Code is optimized!
document.addEventListener("DOMContentLoaded", function() {

    $( "#continueButtonColumn" ).hide();

});

// Code is optimized!
window.onload = function() {

    var element = document.getElementById("animatedTextRow");
    var visibility = isVisible(element)
    console.log("animatedTextRow visibility:",visibility)

    if (visibility !== false) {
        console.log("Animating \"animatedTextRow\" @front page...")
        var elements = document.getElementsByClassName('txt-rotate');
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-rotate');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtRotate(elements[i], JSON.parse(toRotate), period);
            }
      }

      // INJECT CSS
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
      document.body.appendChild(css);

    } else {
        console.log("Not animating...")
    }

    $( "#continueButtonColumn" ).fadeIn(800);

};

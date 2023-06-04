/*
  SpectrumGradientSorter.jsx for Adobe Illustrator
  Description: Convert selected color objects to gradient
  Created: June 4, 2023 by Artem Demidenko

  Free to use, not for sale

  Donate:
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/Ckybe
  - via Donatty https://donatty.com/artemdemidenko
  - via DonatePay https://new.donatepay.ru/@artemdemidenko
  - via YooMoney https://yoomoney.ru/to/4100118201091827

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php
*/
var fillBad = 0;

function main() {
  if (!documents.length) {
    alert('Error\nOpen a document and try again');
    return;
  }

  if (!selection.length || selection.typename == 'TextRange') {
    alert('Error\nPlease select at least one object');
    return;
  }

  var doc = app.activeDocument;

  // Process selected objects
  for (var i = 0, selLen = selection.length; i < selLen; i++) {
    var obj = selection[i];

    if (obj.typename === 'PathItem' && obj.filled && obj.fillColor.typename === 'GradientColor') {
      reorderGradientColors(obj.fillColor.gradient);
    }
  }

  if (fillBad > 0) {
    alert('Fill ' + fillBad + ' object(s) with flat color.\nObjects with gradients, patterns, global colors, or empty fills will be omitted.');
  }
}

function reorderGradientColors(gradient) {
  var stops = gradient.gradientStops;
  var numStops = stops.length;

  // Extract colors from gradient stops
  var colors = [];
  for (var i = 0; i < numStops; i++) {
    colors.push(stops[i].color);
  }

  // Sort colors based on hue
  colors.sort(function(a, b) {
    var hslA = rgbToHsl(a.red / 255, a.green / 255, a.blue / 255);
    var hslB = rgbToHsl(b.red / 255, b.green / 255, b.blue / 255);
    return hslA.hue - hslB.hue;
  });

  // Apply sorted colors back to gradient stops
  for (var i = 0; i < numStops; i++) {
    stops[i].color = colors[i];
  }
}

function rgbToHsl(r, g, b) {
  r = clamp(r, 0, 1);
  g = clamp(g, 0, 1);
  b = clamp(b, 0, 1);

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { hue: h, saturation: s, lightness: l };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

main();

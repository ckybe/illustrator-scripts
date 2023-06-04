/*
  ColorToGradient.jsx for Adobe Illustrator
  Description: Convert selected color objects to gradient
  Created: June 3, 2023 by Artem Demidenko

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
function main() {
  if (!documents.length) {
    alert('Error\nOpen the document and try again');
    return;
  }
  var doc = app.activeDocument;
  var gradient = doc.gradients.add();
  gradient.type = GradientType.LINEAR;

  var rampPointStep = 100 / (selection.length - 1);
  var currentRampPoint = 0;

  for (var i = 0; i < selection.length; i++) {
    var obj = selection[i];

    if (obj.typename === 'CompoundPathItem') {
      var compoundPathItems = obj.pathItems;
      for (var j = 0; j < compoundPathItems.length; j++) {
        var pathItem = compoundPathItems[j];
        if (pathItem.filled) {
          addGradientStopToGradient(gradient, pathItem.fillColor, currentRampPoint);
        }
      }
    } else if (obj.typename === 'PathItem') {
      if (obj.filled) {
        addGradientStopToGradient(gradient, obj.fillColor, currentRampPoint);
      }
    }

    currentRampPoint += rampPointStep;

    if (currentRampPoint > 100) {
      currentRampPoint = 100;
    }
  }

  var newFillColor = new GradientColor();
  newFillColor.gradient = gradient;

  for (var i = 0; i < selection.length; i++) {
    var obj = selection[i];

    if (obj.typename === 'CompoundPathItem') {
      var compoundPathItems = obj.pathItems;
      for (var j = 0; j < compoundPathItems.length; j++) {
        var pathItem = compoundPathItems[j];
        if (pathItem.filled) {
          pathItem.fillColor = newFillColor;
        }
      }
    } else if (obj.typename === 'PathItem') {
      if (obj.filled) {
        obj.fillColor = newFillColor;
      }
    }
  }

  var numStops = gradient.gradientStops.length;
  if (numStops > 2) {
    gradient.gradientStops[0].remove();
    gradient.gradientStops[numStops - 2].remove();
  }

}

function addGradientStopToGradient(gradient, color, rampPoint) {
  var stop = gradient.gradientStops.add();
  stop.rampPoint = rampPoint;
  stop.color = color;
}

function areObjectsSolidColored() {
  var firstFillColor = null;

  for (var i = 0; i < selection.length; i++) {
    var obj = selection[i];

    if (obj.typename === 'CompoundPathItem') {
      var compoundPathItems = obj.pathItems;
      for (var j = 0; j < compoundPathItems.length; j++) {
        var pathItem = compoundPathItems[j];
        if (pathItem.typename !== 'PathItem' || !pathItem.filled) {
          return false;
        }
        if (!firstFillColor) {
          firstFillColor = pathItem.fillColor;
        } else if (firstFillColor.typename !== pathItem.fillColor.typename) {
          return false;
        }
      }
    } else if (obj.typename === 'PathItem') {
      if (obj.typename !== 'PathItem' || !obj.filled) {
        return false;
      }
      if (!firstFillColor) {
        firstFillColor = obj.fillColor;
      } else if (firstFillColor.typename !== obj.fillColor.typename) {
        return false;
      }
    }
  }

  return true;
}

try {
  main();
} catch (e) {
  alert('An error occurred while executing the script:\n' + e);
}

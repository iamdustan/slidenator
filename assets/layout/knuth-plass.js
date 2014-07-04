require('./../bower_components/typeset/src/linked-list');
require('./../bower_components/typeset/src/linebreak');
require('./../bower_components/typeset/src/formatter');

var TOLERANCE = 100;
var ALIGNMENT = 'justify';

function draw(context, nodes, breaks, lineLengths, lineHeight, center) {
  var i = 0, lines = [], point, j, r, lineStart = 0, y = 4, maxLength = Math.max.apply(null, lineLengths);

  // Iterate through the line breaks, and split the nodes at the
  // correct point.
  for (i = 1; i < breaks.length; i += 1) {
    point = breaks[i].position,
    r = breaks[i].ratio;

    for (var j = lineStart; j < nodes.length; j += 1) {
      // After a line break, we skip any nodes unless they are boxes or forced breaks.
      if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -Typeset.linebreak.infinity)) {
        lineStart = j;
        break;
      }
    }
    lines.push({ratio: r, nodes: nodes.slice(lineStart, point + 1), position: point});
    lineStart = point;
  }

  lines.forEach(function (line, lineIndex) {
    var x = 0, lineLength = lineIndex < lineLengths.length ? lineLengths[lineIndex] : lineLengths[lineLengths.length - 1];

    if (center) {
      x += (maxLength - lineLength) / 2;
    }

    line.nodes.forEach(function (node, index, array) {
      if (node.type === 'box') {
        context.fillText(node.value, x, y);
        x += node.width;
      }
      else if (node.type === 'glue') {
        x += node.width + line.ratio * (line.ratio < 0 ? node.shrink : node.stretch);
      }
      else if (node.type === 'penalty' && node.penalty === 100 && index === array.length - 1) {
        context.fillText('-', x, y);
      }
    });

    // move lower to draw the next line
    y += lineHeight;
  });
};

function align(slide, context, type, lineLengths, lineHeight, tolerance, center) {
  type || (type = ALIGNMENT);
  tolerance || (tolerance = TOLERANCE);

  var text = slide.content;

  var format, nodes, breaks;
  context.textBaseline = 'top';

  format = Typeset.formatter(function (str) {
    if (str === ' ')
      return 25;
    //console.log(context.measureText(str).width, str);
    return context.measureText(str).width;
  });

  nodes = format[type](text);

  breaks = Typeset.linebreak(nodes, lineLengths, {tolerance: tolerance});
  // TODO: breaks > max-breaks split across slides
  console.log(text, breaks);

  if (breaks.length !== 0)
    draw(context, nodes, breaks, lineLengths, lineHeight, center);
  else
    context.fillText('Paragraph can not be set with the given tolerance.', 0, 0);
}

module.exports = align;
//align(
//  'The text to align',
//  CanvasRenderindContext,
//  'justify',
//  [350, 350, 350, 200, 200, 200, 200, 200, 200, 200, 350, 350]
//  3
//);


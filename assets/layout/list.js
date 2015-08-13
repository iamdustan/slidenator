var MAX_WIDTH = 1140;
var MAX_LINES = 5;
var ALT_MAX_LINES = 8;

var HAS_BULLETS = false;
var Y_OFFSET = 60;

module.exports = function(slide, ctx, x, y) {
  var LINE_HEIGHT = Math.floor(48 * 1.1666);
  if (this.slides && this.slides[0]) {
    slide.items.forEach(function(a, i) {
      var y = a.y + LINE_HEIGHT;

      ctx.globalAlpha = a.opacity || 1;
      if (HAS_BULLETS) {
        ctx.fillText(a.index + '.', a.x, y + Y_OFFSET);
        ctx.fillText(a.text, a.x + 60, y + Y_OFFSET);
      }
      else {
        ctx.fillText(a.text, a.x, y + Y_OFFSET);
      }
    });
  }

  var lines = [];
  slide.items.forEach(drawLine);

  function drawLine(content, index) {
    var line = '';
    // if (typeof content.split === 'undefined') return content;

    var words = content.split(/\s+/g);
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n];
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > MAX_WIDTH && n > 0) {
        lines.push({text: line, x: x, y: y });
        line = words[n] + ' ';
        y += LINE_HEIGHT;
      }
      else {
        line = testLine + ' ';
      }
    }
    lines.push({text: line, x: x, y: y, index: index + 1});
    y += LINE_HEIGHT + 20;
  }

  var numberOfSlides = lines.length;
  this.slides = Array.apply(0, Array(numberOfSlides)).map(function(_, i) {
    var items = lines.map(function(line, index) {
      if (index > i) return;
      var o = {
        index: line.index,
        text: line.text,
        x: line.x,
        y: line.y,
        opacity: 1,
      };
      /*
      if (index < i) {
        o.opacity = 0.5;
      }
     */

      return o;
    }).filter(Boolean);

    return {
      type: slide.type,
      title: slide.title,
      items: items
    };
  });

  this.activeIndex = 0;
  if (this.props.dir === 'dec')
    this.activeIndex = this.slides.length - 1;

  this.activeSlide = this.slides[this.activeIndex];
  this.drawList();
};


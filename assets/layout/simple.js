var MAX_LINES = 5;
var ALT_MAX_LINES = 8;
var TOP_MARGIN = 180;
var LINE_HEIGHT = Math.floor(64 * 1.4);

function getSlideDispersion(slidesCount, total) {
  var dispersion = Array.apply(0, Array(total)).reduce(function(memo, _, i) {
    var _i = i % slidesCount;
    if (typeof memo[_i] === 'undefined') memo[_i] = 0;
    memo[_i]++;
    return memo;
  }, {});

  return dispersion;
}

module.exports = function(slide, ctx, x, y) {
  var LOCAL_MAX = slide.verse ? MAX_LINES : ALT_MAX_LINES;
  var lines;

  if (Array.isArray(slide.content)) {
    // do nothing?
    lines = slide.content;
    LOCAL_MAX = lines.length;
  }
  else {
    var HANGING_PUNCTUATION = ['“', '…'];
    var words = (slide.content || slide.quote || '').split(' ');
    lines = [];
    var line = '';
    var HANGING_WIDTH = HANGING_PUNCTUATION.map(function(n) {
      return ctx.measureText(n).width;
    });
    for (var n = 0; n < words.length; n++) {

      var testLine = line + words[n];
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > slide.width ||
          (HANGING_PUNCTUATION.indexOf(line[0]) > -1 &&
           testWidth - HANGING_WIDTH[HANGING_PUNCTUATION.indexOf(line[0])] > slide.width)) {
        line = line.split(' ');
        line = line.slice(0, line.length - 1).join(' ');

        if (HANGING_PUNCTUATION.indexOf(line[0]) > -1) {
          lines.push({text: line, x: x - HANGING_WIDTH[HANGING_PUNCTUATION.indexOf(line[0])]});
        }
        else {
          lines.push({text: line, x: x});
        }
        line = words[n] + ' ';
      }
      else {
        line = testLine + ' ';
      }
    }
    lines.push({text: line, x: x});
  }

  if (lines.length <= LOCAL_MAX) {
    var TOP = TOP_MARGIN;
    return lines.forEach(function(a, i) {
      var y = TOP + (i * LINE_HEIGHT);
      if (lines.length < 4)
        y += LINE_HEIGHT;

      ctx.fillText(a.text, a.x, y);
    });
  }

  var numberOfSlides = Math.ceil(lines.length / LOCAL_MAX);
  var slideDispersion = getSlideDispersion(numberOfSlides, lines.length);

  this.slides = Array.apply(0, Array(numberOfSlides)).map(function(_, i) {
    var endIndex = slideDispersion[i];
    return {
      content: lines.splice(0, endIndex),
      verse: slide.verse,
      translation: slide.translation
    };
  });

  this.activeIndex = 0;
  if (this.props.dir === 'dec')
    this.activeIndex = this.slides.length - 1;

  this.activeSlide = this.slides[this.activeIndex];
  this.draw();
};

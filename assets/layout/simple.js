var MAX_LINES = 5;
var ALT_MAX_LINES = 8;
var TOP_MARGIN = 120;

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
  var words = (slide.content || slide.quote).split(' ');
  var lines = [];
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n];
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > slide.width && n > 0) {
      lines.push({text: line, x: x, y: y });
      line = words[n] + ' ';
      y += Math.floor(64 * 1.4);
    }
    else {
      line = testLine + ' ';
    }
  }
  lines.push({text: line, x: x, y: y});

  if (lines.length <= LOCAL_MAX) {
    return lines.forEach(function(a) {
      var y = (lines.length < 3) ? a.y + (64 * 1.4 * 2)
        : (lines.length < 5) ? a.y + (64 * 1.4)
        : a.y;

      ctx.fillText(a.text, a.x, y);
    });
  }

  var numberOfSlides = Math.ceil(lines.length / LOCAL_MAX);
  var slideDispersion = getSlideDispersion(numberOfSlides, lines.length);

  this.slides = Array.apply(0, Array(numberOfSlides)).map(function(_, i) {
    //var startIndex = linesPerSlide * i;
    //var endIndex = startIndex + linesPerSlide;
    var endIndex = slideDispersion[i];
    return {
      content: lines.splice(0, endIndex).reduce(function(s, c) { return s + c.text; }, ''),
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

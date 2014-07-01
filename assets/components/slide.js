/** @jsx React.DOM */

var React = require('react');

var WIDTH = 1280;
var HEIGHT = 720;
var MAX_WIDTH = 1160;
var MAX_LINES = 5;
var ALT_MAX_LINES = 8;
var TOP_MARGIN = 120;

var Slide = React.createClass({

  slide: function() {
    return this.activeSlide || this.props.data;
  },

  draw: function() {
    var slide = this.slide();

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var x = canvas.width / 2;
    var y = TOP_MARGIN;

    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    if (slide.verse) {
      // TODO: if (slide.translation) offset verse from translation while staying centered
      //ctx.font = '36px Medium Gotham';
      //ctx.fillText(slide.translation, x, HEIGHT - 80);
      ctx.font = '300 54px Gotham';
      ctx.fillText(slide.verse + (slide.translation ? ' ' + slide.translation : ''), x, HEIGHT - 80);
    }

    ctx.font = '300 64px Gotham';
    this.layoutText(ctx, x, y);

    ctx.restore();

    canvas.style.transform = this.getTransformString();
  },

  layoutText: function(ctx, x, y) {
    var slide = this.slide();
    var LOCAL_MAX = slide.verse ? MAX_LINES : ALT_MAX_LINES;
    var words = slide.content.split(' ');
    var lines = [];
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n];
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > MAX_WIDTH && n > 0) {
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
    var slideDispersion = this.getSlideDispersion(numberOfSlides, lines.length);

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
  },

  getSlideDispersion: function(slidesCount, total) {
    var dispersion = Array.apply(0, Array(total)).reduce(function(memo, _, i) {
      var _i = i % slidesCount;
      if (typeof memo[_i] === 'undefined') memo[_i] = 0;
      memo[_i]++;
      return memo;
    }, {});

    return dispersion;
  },

  getTransformString: function() {
    var transform = this.props.transform;
    if (!transform)
      return 'scale(1)';

    var str = 'scale(' + (transform.zoom / 100) + ') translate(' + transform.translateX + 'px,' + transform.translateY + 'px)';

    console.log(str);
    return str;
  },

  prev: function() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.activeSlide = this.slides[this.activeIndex];
      this.draw();
      return true;
    }

    return false;
  },

  next: function() {
    if (!this.slides) return false;

    if (this.activeIndex < this.slides.length - 1) {
      this.activeIndex++;
      this.activeSlide = this.slides[this.activeIndex];
      this.draw();
      return true;
    }

    return false;
  },

  componentDidMount: function() {
    this.draw();
  },

  componentWillReceiveProps: function(props) {
    // ensure that the component has update the props
    this.activeIndex = this.activeSlide = this.slides = null;
    setTimeout(this.draw);
  },

  render: function() {
    return (<canvas id="canvas" ref="canvas" width={WIDTH} height={HEIGHT} />);
  }

});

module.exports = Slide;


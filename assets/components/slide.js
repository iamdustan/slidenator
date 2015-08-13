/** @jsx React.DOM */

var React = require('react/addons');

var simple = require('../layout/simple');
var knuthPlass = require('../layout/knuth-plass');
var list = require('../layout/list');
var useKnuthPlass = false;

var WIDTH = 1280;
var HEIGHT = 720;
var MAX_WIDTH = 1060;
var MAX_LINES = 5;
var ALT_MAX_LINES = 8;
var TOP_MARGIN = 160;
var FONT_SIZE = 48;
var LINE_HEIGHT = Math.floor(FONT_SIZE * 1.4);

var Slide = React.createClass({

  exportSuffix: function() {
    if (!this.slides) return '';
    var CHAR_CODE_START = 97; // 97 => 'a'

    return String.fromCharCode(CHAR_CODE_START + this.activeIndex);
  },

  toDataURL: function() {
    return this.getDOMNode().toDataURL('image/png');
  },

  slide: function() {
    return this.activeSlide || this.props.data;
  },

  draw: function() {
    var slide = this.slide();

    if (typeof slide === 'undefined') {
      // empty state
      // TODO: this should be the responsibility of the app
      // to set the default state
      return;
    }

    if (typeof slide.width === 'undefined') slide.width = MAX_WIDTH;
    if (slide.type === 'list') return this.drawList();

    var canvas = this.getDOMNode();
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
    if (slide.title) {
      ctx.font = '300 36px Gotham';
      ctx.fillText(slide.title, x, TOP_MARGIN - FONT_SIZE);
    }

    if (slide.type === 'title') {
      ctx.textAlign = 'center';
      ctx.font = '300 90px Gotham';
    }
    else {
      ctx.textAlign = 'left';
      ctx.font = '300 ' + FONT_SIZE + 'px Gotham';
    }
    if (useKnuthPlass) {
      ctx.translate((WIDTH - slide.width) / 2,  TOP_MARGIN);
      knuthPlass.call(this, slide, ctx, null, [slide.width], FONT_SIZE * 1.4, null);
      ctx.translate(-(WIDTH - slide.width) / 2, -TOP_MARGIN);
    }
    else {
      if (ctx.textAlign === 'center') {
        simple.call(this, slide, ctx, x, y);
      }
      else {
        var _x = x - (slide.width / 2);
        simple.call(this, slide, ctx, _x, y);
      }
    }

    ctx.restore();
  },

  drawList: function() {
    var slide = this.slide();
    var canvas = this.getDOMNode();
    var ctx = canvas.getContext('2d');
    var x = canvas.width / 2;
    var y = TOP_MARGIN - 70;

    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = '300 ' + FONT_SIZE + 'px Gotham';
    ctx.fillText(slide.title, x, 80);

    ctx.textAlign = 'left';
    x = (WIDTH - slide.width) / 2;

    list.call(this, slide, ctx, x, y);
  },

  getTransformString: function() {
    var transform = this.props.transform;
    if (!transform)
      return 'scale(1)';

    return 'scale(' + (transform.zoom / 100) + ') translate(' + transform.translateX + 'px,' + transform.translateY + 'px)';
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
    //this.draw();
  },

  componentWillReceiveProps: function(props) {
    // ensure that the component has update the props
    this.activeIndex = this.activeSlide = this.slides = null;
    setTimeout(this.draw);
    var self = this;
    setTimeout(function() {
      canvas.style.transform = self.getTransformString();
    });
  },

  render: function() {
    return (<canvas id="canvas" ref="canvas" width={WIDTH} height={HEIGHT} />);
  }

});

module.exports = Slide;


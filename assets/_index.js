/** @jsx React.DOM */

var React = require('react');
var KEYS = {
  37: 'prev',
  39: 'next'
};

//var Navigation = require('./components/navigation.js');
var SLIDES = require('./data/slides');
var Slide = require('./components/slide');
var Ripple = require('./components/react-ripple');

var App = React.createClass({
  getInitialState: function() {
    return {
      slides: SLIDES,
      activeSlide: SLIDES[0],
      zoom: 100,
      translateX: 0,
      translateY: 0,
    };
  },

  doSave: function() {
    console.log('TODO: doSave');
  },

  doExport: function() {
    console.log('TODO: doExport');
  },

  onKeyPress: function(e) {
    var method = KEYS[e.keyCode];
    if (!this[method]) return;
    e.preventDefault();
    this[method]();
  },

  activeIndex: function() {
    return this.state.slides.indexOf(this.state.activeSlide);
  },

  prev: function() {
    if (this.refs.slide.prev()) return;

    var index = this.activeIndex();
    if (index > 0)
      this.setState({activeSlide: this.state.slides[index - 1], dir: 'dec'});
  },

  next: function() {
    if (this.refs.slide.next()) return;

    var index = this.activeIndex();
    if (index < this.state.slides.length - 1)
      this.setState({activeSlide: this.state.slides[index + 1], dir: 'inc'});
  },

  addSlide: function() {
    window.newSlide = {
      content: 'this is a verse',
      verse: 'Alphabet Soup 1:23',
      translation: 'WORD',
    };
    this.state.slides.push(newSlide);
    this.setState({slides: this.state.slides});
    console.log('added slide');
  },

  removeSlide: function() {
    var activeIndex = this.activeIndex();
    var slides = this.state.slides.slice(activeIndex, 1);
    var newActive = activeIndex ? (activeIndex - 1) : 0;
    this.setState({slides: slides, activeSlide: slides[newActive]});
    console.log('removed slide');
  },

  downAction: function() {
  },

  moveAction: function() {
  },

  upAction: function() {
  },

  componentDidUnmount: function() {
    document.body.removeEventListener('keydown', this.onKeyPress, false);
  },

  componentDidMount: function() {
    document.body.addEventListener('keydown', this.onKeyPress, false);
  },

  zoomOut: function() {
    this.setState({zoom: Math.max(0, this.state.zoom - 5)});
  },

  zoomIn: function() {
    this.setState({zoom: Math.min(100, this.state.zoom + 5)});
  },

  coords: function(e) {
    var x = e.lastTouches ? e.lastTouches[0].clientX : e.clientX;
    var y = e.lastTouches ? e.lastTouches[0].clientY : e.clientY;
    return {x:x, y:y};
  },

  downAction: function(e) {
    console.log('downAction');
    this.isMoving = true;
    this.startCoords = this.coords(e);
    this.startTranslate = {
      x: this.state.translateX,
      y: this.state.translateY,
    }
  },

  moveAction: function(e) {
    if (!this.isMoving) return;

    var coords = this.coords(e);
    var diffX = coords.x - this.startCoords.x;
    var diffY = coords.y - this.startCoords.y;
    this.setState({
      translateX: this.startTranslate.x + diffX,
      translateY: this.startTranslate.y + diffY,
    });
  },

  upAction: function() {
    console.log('upAction');
    this.isMoving = false;
  },

  render: function() {
    return (
      <div onKeyPress={this.onKeyPress}>
        <div className="navbar">
          <div className="logo">Sliders</div>
          <nav id="menu">
            <button onClick={this.doSave}>
              Save
              <Ripple recenteringTouch />
            </button>
            <button onClick={this.doExport}>
              Export
              <Ripple />
            </button>
            <button onClick={this.addSlide}>
              Add Slide
              <Ripple />
            </button>
            <button onClick={this.removeSlide}>
              Remove Slide
              <Ripple />
            </button>
          </nav>
          <div id="toolbar">
            <button onClick={this.zoomOut}>-<Ripple /></button>
            <button onClick={this.zoomIn}>+<Ripple /></button>
          </div>
        </div>
        <div
          id="artboard"
          onMouseDown={this.downAction}
          onMouseMove={this.moveAction}
          onMouseUp={this.upAction}>
          <Slide
            transform={{
              zoom: this.state.zoom,
              translateX: this.state.translateX,
              translateY: this.state.translateY,
            }}
            ref="slide"
            data={this.state.activeSlide}
            dir={this.state.dir} />
        </div>
      </div>
    );
  }

});

module.exports = App;


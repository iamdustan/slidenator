/** @jsx React.DOM */

var React = require('react/addons');
var Joi = require('joi');
var last = function(a) { return a[a.length - 1]; };

var KEYS = {
  37: 'prev',
  39: 'next'
};

//var Navigation = require('./components/navigation.js');
var SLIDES = require('./data/slides');
/*
var SLIDES = [
  { content: 'This is some content that will be laid out automatically. Slide navigation currently borked. :)' }
];
*/

var Form = require('./components/form');
var Modal = require('./components/modal');
var Ripple = require('./components/react-ripple');
var Slide = require('./components/slide');

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
    var schema = Joi.object().keys({
      Content: Joi.string().required(),
      Translation: Joi.string().regex(/[a-zA-Z0-9]{3,10}/),
      Verse: Joi.string(),
    });

    this.setModal({
      title: 'Add A New Slide',
      content: (<Form schema={schema} onSuccess={addSlide} />)
    });

    var self = this;
    var state = this.state;
    function addSlide(data){
      var slide = {
        content: data.Content,
        translation: data.Translation,
        verse: data.Verse,
      };

      var slides = React.addons.update(state, {
        slides: {$push: [slide]}
      }).slides;

      self.setState({
        slides: slides,
        activeSlide: last(slides),
        modalTitle: '',
        modalContent: '',
      });
    }
  },

  removeSlide: function() {
    var activeIndex = this.activeIndex();
    var slides = this.state.slides.slice(activeIndex, 1);
    var newActive = activeIndex ? (activeIndex - 1) : 0;
    this.setState({slides: slides, activeSlide: slides[newActive]});
    console.log('removed slide');
  },

  componentDidUnmount: function() {
    document.body.removeEventListener('keydown', this.onKeyPress, false);
  },

  componentWillMount: function() {
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
    this.isMoving = false;
  },

  setModal: function(data) {
    this.setState({
      modalTitle: data.title,
      modalContent: data.content
    });
  },

  componentDidMount: function() {
    var artboard = this.refs.artboard.getDOMNode();
    var slide = this.refs.slide.getDOMNode();
    var aw = artboard.clientWidth;
    var ah = artboard.clientHeight;
    var sw = slide.clientWidth;
    var sh = slide.clientHeight;
    var scale = aw / sw;
    if (aw > sw) scale = 1;
    this.setState({
      zoom: scale * 100,
      translateX: -(sw - aw) / 2 / scale,
      translateY: (ah - sh) / 8 / scale,
    });
  },

  render: function() {
    return (
      <div>
        <div className="navbar">
          <div className="logo">Sliders</div>
          <nav id="menu">
            <button onClick={this.doSave}>
              Save<Ripple recenteringTouch />
            </button>
            <button onClick={this.doExport}>
              Export<Ripple />
            </button>
            <button onClick={this.addSlide}>
              Add Slide<Ripple />
            </button>
            <button onClick={this.removeSlide}>
              Remove Slide<Ripple />
            </button>
          </nav>
          <div id="toolbar">
            <button onClick={this.zoomOut}>-<Ripple /></button>
            <button onClick={this.zoomIn}>+<Ripple /></button>
          </div>
        </div>
        <div
          id="artboard"
          ref="artboard"
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
        <Modal title={this.state.modalTitle} cancelHandler={this.setModal.bind(this, {})}>
          {this.state.modalContent}
        </Modal>
      </div>
    );
  }

});

module.exports = App;


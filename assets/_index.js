/** @jsx React.DOM */

if (typeof process === 'undefined' || process.title === 'browser')
  require('./stylesheet.css');

var React = require('react/addons');

function last(a) { return a[a.length - 1]; }
function pad(a) { return (a < 10 ? '0' : '') + a; }

var KEYS = {
  37: 'prev',
  39: 'next'
};

var slideSchema = require('./data/slide-schema');
var SLIDES = require('./data/slides');
//var SLIDES = [];

var Form = require('./components/form');
var Modal = require('./components/modal');
var RippleButton = require('./components/ripple-button');
var Slide = require('./components/slide');

var App = React.createClass({
  getInitialState: function() {
    return {
      slides: SLIDES,
      activeSlide: SLIDES[0],
      zoom: 100,
      translateX: 0,
      translateY: 0,
      isEditing: !SLIDES[0],
    };
  },

  doSave: function() {
    var index = pad(this.state.slides.indexOf(this.state.activeSlide));
    var filename = index + this.refs.slide.exportSuffix() + '.png';
    var dataURL = this.refs.slide.toDataURL();
    console.log('Saving %s', filename);

    var btn = document.createElement('a');
    btn.style.display = 'none';
    document.body.appendChild(btn);
    btn.href = dataURL.replace('image/png', 'image/octet-stream');
    btn.download = filename;
    btn.click();
    document.body.removeChild(btn);
  },

  doExport: function() {
    return console.log('TODO: do export');
    /*
    this.setState({
      activeSlides: this.state.slides[0]
    });

    do { this.doSave(); } while (this.next());
    */
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
    if (this.refs.slide.prev()) return true;

    var index = this.activeIndex();
    if (index <= 0) return false;

    this.setState({activeSlide: this.state.slides[index - 1], dir: 'dec'});
    return true;
  },

  next: function() {
    if (this.refs.slide.next()) return true;

    var index = this.activeIndex();
    if (index >= this.state.slides.length - 1) return false;

    this.setState({activeSlide: this.state.slides[index + 1], dir: 'inc'});
    return true;
  },

  editSlide: function(changes) {
    var activeSlideIndex = this.state.slides.indexOf(this.state.activeSlide);

    var activeSlide = React.addons.update(this.state.activeSlide, {$merge: changes});
    var updateSlide = {};
    updateSlide[activeSlideIndex] = {$set: activeSlide};
    var slides = React.addons.update(this.state.slides, updateSlide);

    this.setState({activeSlide: activeSlide, slides: slides});
  },

  addSlide: function(data) {
    var slide = {
      content: data.Content,
      verse: data.Verse,
      translation: data.Translation,
      width: data.Width,
    };

    var slides = React.addons.update(
      this.state.slides,
      {$push: [slide]}
    );

    this.setState({
      slides: slides,
      activeSlide: last(slides),
    });
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
    if (typeof document === 'undefined') return;

    document.body.addEventListener('keydown', this.onKeyPress, false);
  },

  zoomOut: function() {
    this.setState({zoom: Math.max(0, this.state.zoom - 5)});
  },

  zoomIn: function() {
    var zoom = Math.min(100, this.state.zoom + 5);
    //console.log(this.state.zoom, zoom);
    //var translateX = this.state.translateX;
    //var translateY = this.state.translateY;

    this.setState({zoom: zoom});
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
    };
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

  toggleEdit: function() {
    this.setState({isEditing: !this.state.isEditing});
  },

  render: function() {
    var onChange, editingSlide;
    if (this.state.isEditing) {
      onChange = this.editSlide;
      editingSlide = this.state.activeSlide;
    }

    return (
      <div>
        <div className="navbar">
          <div className="logo">Slidenator</div>
          <nav id="menu">
            <RippleButton onClick={this.doSave}>Save</RippleButton>
            <RippleButton onClick={this.doExport}>Export</RippleButton>
          </nav>
          <div id="toolbar">
            <RippleButton onClick={this.zoomOut}>-</RippleButton>
            <RippleButton onClick={this.zoomIn}>+</RippleButton>
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

        <div
          id="tools"
          ref="tools">
          <Form data={editingSlide} schema={slideSchema} submitLabel="Add Slide" onSuccess={this.addSlide} onChange={onChange} />
          <RippleButton onClick={this.removeSlide}>Remove Slide</RippleButton>
          <RippleButton onClick={this.toggleEdit}>Edit Slide</RippleButton>
        </div>

        <Modal title={this.state.modalTitle} cancelHandler={this.setModal.bind(this, {})}>
          {this.state.modalContent}
        </Modal>
      </div>
    );
  }
});

module.exports = App;


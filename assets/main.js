(function (){
  'use strict';
  var WIDTH = 1280;
  var HEIGHT = 720;
  var MAX_WIDTH = 1160;
  var MAX_LINES = 5;
  var ALT_MAX_LINES = 8;
  var TOP_MARGIN = 120;

  /*
    <a id="save">Save</a>
    <a id="export">Export</a>
    <canvas id="canvas"></canvas>
    <canvas id="scratch" style="display:none;"></canvas>
    */

  var SLIDES = [
    { content: 'Be still, and know that I am God!',
      verse: 'Psalms 46:10',
      translation: 'NLT'
    },
    { content: 'Those who live in the shelter of the Most High will find rest in the shadow of the Almighty.',
      verse: 'Psalms 91:1',
      translation: 'NLT'
    },
    { content: 'Remain in me, and I will remain in you. For a branch cannot produce fruit if it is severed from the vine, and you cannot be fruitful unless you remain in me. “Yes, I am the vine; you are the branches. Those who remain in me, and I in them, will produce much fruit. For apart from me you can do nothing. Anyone who does not remain in me is thrown away like a useless branch and withers. Such branches are gathered into a pile to be burned. But if you remain in me and my words remain in you, you may ask for anything you want, and it will be granted!',
      verse: 'John 15:4-7',
      translation: 'NLT'
    },
    { content: 'ABIDE. To be or exist, to continue, to rest or dwell in, to stand firm or be stationary, fixed state, residence. It is a word that implies not a temporary situation but a permanent dwelling place—a place to make your home.', },

    { content: 'Live in me. Make your home in me just as I do in you. In the same way that a branch can’t bear grapes by itself but only by being joined to the vine, you can’t bear fruit unless you are joined with me. I am the Vine, you are the branches. When you’re joined with me and I with you, the relation intimate and organic, the harvest is sure to be abundant. Separated, you can’t produce a thing. Anyone who separates from me is deadwood, gathered up and thrown on the bonfire. But if you make yourselves at home with me and my words are at home in you, you can be sure that whatever you ask will be listened to and acted upon.',
      verse: 'John 15:4-10',
      translation: 'Message'
    },
    { content: 'I’ve loved you the way my Father has loved me. Make yourselves at home in my love.',
      verse: 'John 15:4-10',
      translation: 'Message'
    },
    { content: 'We know how much God loves us, and we have put our trust in his love. God is love, and all who live in love live in God, and God lives in them. And as we live in God, our love grows more perfect. So we will not be afraid on the day of judgment, but we can face him with confidence because we live like Jesus here in this world. Such love has no fear, because perfect love expels all fear. If we are afraid, it is for fear of punishment, and this shows that we have not fully experienced his perfect love.',
      verse: '1 John 4:16-18',
      translation: 'NLT'
    },
    { content: 'Are you tired? Worn out? Burned out on religion? Come to me. Get away with me and you’ll recover your life. I’ll show you how to take a real rest. Walk with me and work with me—watch how I do it. Learn the unforced rhythms of grace. I won’t lay anything heavy or ill-fitting on you. Keep company with me and you’ll learn to live freely and lightly.',
      verse: 'Matthew 11:28-30',
      translation: 'Message'
    },
    { content: 'Now that we know what we have—Jesus, this great High Priest with ready access to God—let’s not let it slip through our fingers. We don’t have a priest who is out of touch with our reality. He’s been through weakness and testing, experienced it all—all but the sin. So let’s walk right up to him and get what he is so ready to give. Take the mercy, accept the help.',
      verse: 'Hebrews 4:14-16',
      translation: 'Message'
    },
  ];

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var scratch = document.getElementById('scratch');
  var scratchContext = scratch.getContext('2d');

  canvas.width = scratch.width = WIDTH;
  canvas.height = scratch.height = HEIGHT;

  var saveButton = document.getElementById('save');
  var exportButton = document.getElementById('export');

  saveButton.addEventListener('click', function(e) {
    activeSlide.download();
  });

  exportButton.addEventListener('click', function(e) {
    Slides.forEach(function(s) { s.download(); });
  });

  var Slides = SLIDES.map(Slide);

  function Slide(opts) {
    if (!(this instanceof Slide)) {
      return new Slide(opts);
    }
    this.content = opts.content;
    this.verse = opts.verse;
    this.translation = opts.translation;
  }

  Slide.prototype.draw = function draw() {
    var x = canvas.width / 2;
    var y = TOP_MARGIN;
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    ctx.font = '300 64px Gotham';
    wrapText.apply(this);

    if (this.verse) {
      ctx.font = '300 54px Gotham';
      ctx.fillText(this.verse + (this.translation ? ' ' + this.translation : ''), x, HEIGHT - 80);
    }
    /*

    if (this.translation) {
      ctx.font = '36px Medium Gotham';
      ctx.fillText(this.translation, x, HEIGHT - 80);
    }
    */

    ctx.restore();

    function wrapText() {
      var LOCAL_MAX = this.verse ? MAX_LINES : ALT_MAX_LINES;
      var text = this.content;
      var words = text.split(' ');
      var lines = [];
      var line = '';

      for(var n = 0; n < words.length; n++) {
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
      console.log('lines.length', lines.length);


      if (lines.length <= LOCAL_MAX) {
        return lines.forEach(function(a) {
          var y = (lines.length < 3) ? a.y + (64 * 1.4 * 2)
            : (lines.length < 5) ? a.y + (64 * 1.4)
            : a.y;

          ctx.fillText(a.text, a.x, y);
        });
      }

      var numberOfSlides = Math.ceil(lines.length / LOCAL_MAX);
      var linesPerSlide = Math.ceil(lines.length / numberOfSlides);

      this.content = lines.slice(0, linesPerSlide).reduce(function(s, c) { return s + c.text; }, '');

      var newSlides = Array.apply(0, Array(numberOfSlides-1)).map(function(_, i) {
        var c = this.clone();
        var startIndex = linesPerSlide * i + linesPerSlide;
        var endIndex = startIndex + linesPerSlide;
        c.content = lines.slice(startIndex, endIndex).reduce(function(s, c) { return s + c.text; }, '');

        return c;
      }, this);

      Slides.splice.apply(Slides, [activeIndex + 1, 0].concat(newSlides));
      this.draw();
    }
  };

  Slide.prototype.download = function download(){
    var thisIndex = Slides.indexOf(this);

    this.draw();
    var btn = document.createElement('a');
    btn.style.display = 'none';
    document.body.appendChild(btn);
    btn.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    btn.download = pad(thisIndex) + '.png';
    console.log(btn.download);
    btn.click();
    document.body.removeChild(btn);
  };

  Slide.prototype.clone = function clone() {
    return new Slide({content: this.content, verse: this.verse, translation: this.translation});
  }

  function pad(n) {
    if (n < 10) return '0' + n;
    return '' + n;
  }

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 37) previous();  // left
    if (e.keyCode === 39) next()  // right
  });

  var activeIndex = 0;
  function previous() {
    if (activeIndex > 0) {
      activeIndex--;
      render();
    }
  }
  function next() {
    if (activeIndex < Slides.length - 1) {
      activeIndex++;
      render();
    }
  }

  function render() {
    window.activeSlide = Slides[activeIndex];
    window.activeSlide.draw();
  }

  render();
  window.Slides = Slides;
})();


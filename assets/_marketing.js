/** @jsx React.DOM */

if (typeof process === 'undefined' || process.title === 'browser')
  require('./marketing.css');

var React = require('react/addons');
var RippleButton = require('./components/ripple-button');
var logo = require('./logo');

var Page = React.createClass({
  render: function() {
    return (
      <div>
        <header className="navbar">
          <div className="logo">
            <logo />
          </div>
        </header>
        <main>
          <div id="banner">
            <p>Typographically perfect slides.</p>
            <p>Every time.</p>
            <div id="mc_embed_signup">
              <form action="//slidenator.us8.list-manage.com/subscribe/post?u=afd4c67b56b540d9f00e06d22&amp;id=e225f51a66" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" novalidate>
                <h2>Slidenator will be released soon. Be the first to when Slidenator is released.</h2>
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL">Email Address</label>
                  <input type="email" value="" name="EMAIL" className="required email" id="mce-EMAIL" />
                </div>
                <div id="mce-responses">
                  <div className="response" id="mce-error-response" style={{display:'none'}}></div>
                  <div className="response" id="mce-success-response" style={{display:'none'}}></div>
                </div>
                <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_afd4c67b56b540d9f00e06d22_e225f51a66" tabindex="-1" value="" /></div>
                <RippleButton value="Subscribe" name="subscribe" id="mc-embedded-subscribe">Sign up</RippleButton>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
});

module.exports = Page;



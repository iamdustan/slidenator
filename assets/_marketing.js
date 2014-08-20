/** @jsx React.DOM */

if (typeof process === 'undefined' || process.title === 'browser')
  require('./marketing.css');

var React = require('react/addons');
var RippleButton = require('./components/ripple-button');
var logo = require('./logo');

var Page = React.createClass({
  getInitialState: function() {
    return {email: ''};
  },

  onChange: function(e) {
    var o = {};
    o[e.target.name.toLowerCase()] = e.target.value;
    this.setState(o);
  },

  render: function() {
    return (
      <div>
        <main id="banner">
          <div className="logo"><logo color="light" /></div>
          <div className="tagline">
            <p>Typographically perfect slides.</p>
            <p>Every time.</p>
          </div>
          <div id="mc_embed_signup">
            <form action="//slidenator.us8.list-manage.com/subscribe/post?u=afd4c67b56b540d9f00e06d22&amp;id=e225f51a66" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
              <h2>Slidenator will be released soon. Be the first to when Slidenator is released.</h2>
              <div className="mc-field-group">
                <label htmlFor="mce-EMAIL">Email Address</label>
                <input type="email" value={this.state.email} name="EMAIL" className="required email" id="mce-EMAIL" onChange={this.onChange} />
                <RippleButton value="Subscribe" name="subscribe" id="mc-embedded-subscribe">Sign up</RippleButton>
              </div>
              <div id="mce-responses">
                <div className="response" id="mce-error-response" style={{display:'none'}}></div>
                <div className="response" id="mce-success-response" style={{display:'none'}}></div>
              </div>
              <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_afd4c67b56b540d9f00e06d22_e225f51a66" tabIndex="-1" value="" /></div>
            </form>
          </div>
          <img src="/public/images/banner.jpg" alt="Slide and moon, by halfrain. https://www.flickr.com/photos/halfrain/14089859026/in/photolist-5keFrC-euzdvv-5Rz9G-nt5dcU-7Jb7zY-ncCPiW-9NN1YQ-6HawEY-aBJARH-72weav-4Z8oZC-2BNHmf-9uFsHR-mf9MtQ-8LMv8k-mf9Q4j-AqBRc-vxijM-9tA7j7-aBMrnW-mf7YWp-narhbx-nGN4bR-axFTMT-4rZUfW-hz4Tzg-AqBR7-c47123-8dXQ6g-c6tF73-92vtVH-6uvBct-egiD4v-8ovy9r-6Xv3Xx-72vrgc-9vGQq1-9N8MjP-6Y338r-7Y18GV-zB2LB-nqAJPB-8mbXh8-6f81ss-6f3QZR-29EBsZ-9k6HmE-5n5LP-5ESKn-npKM5Y" />
        </main>
        <footer>
          <p>Copyright &copy; {(new Date()).getFullYear()} kastwell, llc</p>
        </footer>
      </div>
    );
  }
});

module.exports = Page;



module.exports = function(markup) {

  var jsdom = require('jsdom')
  const { JSDOM } = jsdom;
  const { document } = (new JSDOM('')).window;
  global.document = document;
  global.window = document.defaultView

  window.matchMedia = window.matchMedia || function() {
    return {
    matches : false,
      addListener : function() {},
      removeListener: function() {}
    };
  };

  if (typeof document !== 'undefined') return

  // Stub `matchMedia` to silence errors
  global.window.matchMedia = global.window.matchMedia || function() {
    return {
      matches : false,
      addListener : function() {},
      removeListener: function() {}
    }
  }

  global.navigator = {
    userAgent: 'chrome'
  }
}
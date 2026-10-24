(function () {
  function vendorModule() {
    'use strict';

    return {
      default: self['FroalaEditor'],
      __esModule: true,
    };
  }

  // Classic builds have loader.js and get an importable `froala-editor` module. Embroider and Vite apps have no
  // `define`, and resolve `froala-editor` themselves.
  if (typeof define === 'function') {
    define('froala-editor', [], vendorModule);
  }
})();

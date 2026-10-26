'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Like the web app, use the vendor build (with its plugins) instead of a
    // second webpack copy of froala-editor for imports in tests.
    autoImport: {
      exclude: ['froala-editor'],
    },
    '@coschedule/ember-froala-editor': {
      // Same plugin list as the CoSchedule web app.
      plugins: [
        'align',
        'char_counter',
        'code_beautifier',
        'code_view',
        'colors',
        'draggable',
        'entities',
        'file',
        'fullscreen',
        'image',
        'link',
        'lists',
        'paragraph_format',
        'quick_insert',
        'quote',
        'special_characters',
        'table',
        'url',
        'video',
        'word_paste',
      ],
      languages: false,
      themes: true,
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};

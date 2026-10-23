import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render, settled, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import FroalaEditor from 'froala-editor';
import FroalaEditorComponent from '@coschedule/ember-froala-editor/components/froala-editor';

class ConfiguredFroalaEditor extends FroalaEditorComponent {
  charCounterCount = false;

  constructor(...args) {
    super(...args);
    this.options = { heightMin: 123, toolbarSticky: false };
  }

  @action
  'on-initialized'(editor) {
    this.args.onReady?.(editor);
  }
}

module('Integration | Component | froala-editor subclass', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'component:configured-froala-editor',
      ConfiguredFroalaEditor,
    );
  });

  test('it merges config, subclass options and arguments', async function (assert) {
    let editor;
    this.ready = (instance) => (editor = instance);

    await render(hbs`<ConfiguredFroalaEditor
  @heightMin={{150}}
  @spellcheckEnabled={{false}}
  @onReady={{this.ready}}
/>`);
    await waitUntil(() => editor);

    assert.strictEqual(
      typeof FroalaEditor.PLUGINS.charCounter,
      'function',
      'configured plugins are registered',
    );
    assert.strictEqual(editor.opts.placeholderText, 'Placeholder from config');
    assert.false(editor.opts.charCounterCount, 'class fields are options');
    assert.false(editor.opts.toolbarSticky, 'this.options is applied');
    assert.strictEqual(editor.opts.heightMin, 150, 'arguments win');
    assert.strictEqual(
      editor.opts.spellcheckEnabled,
      undefined,
      'non-Froala arguments are ignored',
    );
    assert.dom('.fr-toolbar').exists();
    assert.dom('.fr-element[contenteditable="true"]').exists();
  });

  test('it renders @content and forwards on-* argument callbacks', async function (assert) {
    let editor;
    this.ready = (instance) => (editor = instance);
    this.content = htmlSafe('<p>Hello</p>');
    const keypresses = [];
    this.keypress = (...args) => keypresses.push(args);
    this.update = (html) => {
      assert.step(`update:${html}`);
    };

    await render(hbs`<ConfiguredFroalaEditor
  @content={{this.content}}
  @update={{this.update}}
  @on-keypress={{this.keypress}}
  @onReady={{this.ready}}
/>`);
    await waitUntil(() => editor);

    assert.dom('.fr-element').hasText('Hello');

    editor.events.trigger('keypress', ['event-arg']);
    editor.html.set('<p>Changed</p>');
    editor.undo.saveStep();
    await settled();

    assert.verifySteps(['update:<p>Changed</p>']);
    assert.deepEqual(
      keypresses,
      [[editor, 'event-arg']],
      'on-* callbacks get the editor first',
    );
  });

  test('it updates the editor when @content and @disabled change', async function (assert) {
    let editor;
    this.ready = (instance) => (editor = instance);
    this.content = htmlSafe('<p>One</p>');
    this.disabled = false;

    await render(hbs`<ConfiguredFroalaEditor
  @content={{this.content}}
  @disabled={{this.disabled}}
  @onReady={{this.ready}}
/>`);
    await waitUntil(() => editor);

    this.set('content', htmlSafe('<p>Two</p>'));
    this.set('disabled', true);
    await settled();

    assert.strictEqual(editor.html.get(), '<p>Two</p>');
    assert.true(editor.edit.isDisabled());
  });
});

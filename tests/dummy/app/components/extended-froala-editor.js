import FroalaEditorComponent from '@coschedule/ember-froala-editor/components/froala-editor';
import { action } from '@ember/object';

export default class ExtendedFroalaEditorComponent extends FroalaEditorComponent {
  options = {
    theme: 'gray',
  };

  @action 'on-initialized'(/*editor*/) {
    if (typeof this.args.runAssert === 'function') {
      this.args.runAssert();
    }
  }
}

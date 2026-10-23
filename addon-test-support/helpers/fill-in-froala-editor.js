import { isHTMLSafe } from '@ember/template';
import { find, fillIn } from '@ember/test-helpers';

export async function fillInFroalaEditor(selector, html) {
  let element = find(`${selector} [contenteditable]`);

  if (element === null) {
    throw (
      `[contenteditable] DOM element not found within the selector '${selector}'. ` +
      "Try adding 'await settled();' in your test before and after using 'fillInFroalaEditor()'"
    );
  }

  html = isHTMLSafe(html) ? html.toString() : html;

  return fillIn(element, html);
}

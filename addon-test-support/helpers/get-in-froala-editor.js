import { find } from '@ember/test-helpers';

export function getInFroalaEditor(selector) {
  let element = find(`${selector} [contenteditable]`) || find(selector);

  if (element === null) {
    throw `getInFroalaEditor(): DOM element not found with the selector '${selector}'`;
  }

  return element.innerHTML.trim();
}

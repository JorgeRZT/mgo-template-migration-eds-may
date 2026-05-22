/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mango site-wide cleanup.
 * Removes non-authorable content and cleans DOM for import.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove loading spinners (found: div.Loader-module__5bWs1W__loader)
    WebImporter.DOMUtils.remove(element, ['[class*="Loader-module"]']);

    // Remove screen-reader-only loading text (found: p.srOnly-module "Cargando video")
    WebImporter.DOMUtils.remove(element, ['[class*="srOnly-module"]']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove legal disclaimer below newsletter form
    // (found: div.ExpandableTextByLink-module__QFp3YG__expandableContent with legal text)
    WebImporter.DOMUtils.remove(element, ['[class*="ExpandableTextByLink-module"]']);

    // Remove inline style attributes - not useful for EDS import
    element.querySelectorAll('[style]').forEach((el) => {
      el.removeAttribute('style');
    });
  }
}

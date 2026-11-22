// Importing the npm build sets the globals the site's editor scripts use (CMS, h, html,
// DOMPurify, marked) and bundles fonts, grammars and libraries so nothing loads from a CDN.
// admin/index.html imports this file, registers the HTML editor field type, loads the site's
// scripts, then calls CMS.init().
import CMS from '@sveltia/cms';

export { registerHtmlEditor } from 'sveltia-html-editor';
export default CMS;

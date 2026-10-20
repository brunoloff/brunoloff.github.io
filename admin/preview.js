CMS.registerPreviewStyle('/assets/css/fonts.css');
CMS.registerPreviewStyle('/assets/css/site.css');
CMS.registerPreviewStyle('/admin/preview.css');
const PagePreview = ({entry, getAsset}) => {
  const template = document.createElement('template');
  template.innerHTML = DOMPurify.sanitize(entry.getIn(['data', 'body']) || '');
  for (const image of template.content.querySelectorAll('img[src]')) {
    const path = image.getAttribute('src');
    const asset = getAsset(path);
    // Preserve previews of new uploads; published images load from this site's own origin.
    image.src = asset?.url?.startsWith('blob:') ? asset.url : new URL(path, location.origin).href;
  }
  return h('article', {className: entry.getIn(['data','permalink']) === '/' ? 'homepage' : ''},
    h('h1', {className: 'entry-title', 'data-key-path': 'title'}, entry.getIn(['data', 'title'])),
    h('div', {className: 'entry-content', 'data-key-path': 'body', dangerouslySetInnerHTML: {__html: template.innerHTML}})
  );
};
for (const collection of ['main', 'courses', 'research', 'archive']) {
  CMS.registerPreviewTemplate(collection, PagePreview);
}

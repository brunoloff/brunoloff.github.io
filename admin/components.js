/* Preserve the WordPress photo blocks and expandable teaching notes in visual editing. */
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const photoHTML = ({src = '', alt = '', link = '', width = 544, caption = ''} = {}) => {
  const image = `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" width="${Number(width) || 544}" style="width:${Number(width) || 544}px;max-width:100%;height:auto">`;
  return `<figure class="aligncenter">${link ? `<a href="${escapeHTML(link)}">${image}</a>` : image}${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}</figure>`;
};
CMS.registerEditorComponent({
  id: 'photo', label: 'Photo', icon: 'photo', collapsed: true,
  fields: [
    {name: 'src', label: 'Photo', widget: 'image'},
    {name: 'alt', label: 'Image description', widget: 'string', required: false},
    {name: 'link', label: 'Link', widget: 'string', required: false},
    {name: 'width', label: 'Display width', widget: 'number', value_type: 'int', min: 1, default: 544},
    {name: 'caption', label: 'Caption', widget: 'string', required: false}
  ],
  pattern: /^<figure[^>]*>(?<body>[\s\S]*?)<\/figure>/m,
  fromBlock: match => ({src: '', alt: '', width: 544, caption: match.groups?.body ?? ''}),
  toBlock: photoHTML,
  htmlSelector: 'div.wp-block-image, figure',
  fromBlockHTML: element => {
    const image = element.querySelector('img');
    if (!image) return undefined;
    return {src: image.getAttribute('src') ?? '', alt: image.getAttribute('alt') ?? '', link: image.closest('a')?.getAttribute('href') ?? '', width: parseInt(image.style.width || image.getAttribute('width'), 10) || 544, caption: element.querySelector('figcaption')?.textContent ?? ''};
  },
  toBlockHTML: photoHTML,
  toPreview: photoHTML
});
const detailsHTML = ({summary = '', content = ''} = {}) => `<details><summary>${escapeHTML(summary)}</summary>${content}</details>`;
CMS.registerEditorComponent({
  id: 'details', label: 'Expandable section', icon: 'expand_more', collapsed: true,
  fields: [
    {name: 'summary', label: 'Heading', widget: 'string'},
    {name: 'content', label: 'Content', widget: 'richtext', format: 'html', editor_components: ['image', 'code-block', 'table', 'hr', 'photo', 'details']}
  ],
  pattern: /^<details[^>]*>\s*<summary>(?<summary>[\s\S]*?)<\/summary>(?<content>[\s\S]*?)<\/details>/m,
  toBlock: detailsHTML,
  htmlSelector: 'details',
  fromBlockHTML: element => {
    const copy = element.cloneNode(true);
    const summary = copy.querySelector(':scope > summary');
    const heading = summary?.textContent ?? '';
    summary?.remove();
    return {summary: heading, content: copy.innerHTML};
  },
  toBlockHTML: detailsHTML,
  toPreview: detailsHTML
});

// Only embed HTML graphics hosted among this website's own assets.
const graphicPath = (src = '') => {
  try {
    const url = new URL(src, location.origin);
    return url.origin === location.origin && /^\/assets\/.+\.html$/.test(url.pathname) ? url.pathname + url.search + url.hash : '';
  } catch { return ''; }
};
const graphicHTML = ({src = '', title = 'Interactive graphic', height = 700} = {}) => {
  const path = graphicPath(src);
  if (!path) return '<p>Choose an HTML graphic under /assets/.</p>';
  return `<iframe src="${escapeHTML(path)}" title="${escapeHTML(title)}" width="100%" height="${Math.max(300, Math.min(2000, Number(height) || 700))}" style="display:block;border:0"></iframe>`;
};
CMS.registerEditorComponent({
  id: 'graphic', label: 'Interactive graphic', icon: 'monitoring', collapsed: true,
  fields: [
    {name: 'src', label: 'HTML file', widget: 'string', hint: 'For example /assets/ai-papers.html', pattern: ['^/assets/.+\\.html(?:[?#].*)?$', 'Use an HTML file under /assets/.']},
    {name: 'title', label: 'Description', widget: 'string', default: 'Interactive graphic'},
    {name: 'height', label: 'Height in pixels', widget: 'number', value_type: 'int', min: 300, max: 2000, default: 700}
  ],
  pattern: /^<iframe\b[^>]*>[\s\S]*?<\/iframe>/m,
  toBlock: graphicHTML,
  htmlSelector: 'iframe',
  fromBlockHTML: element => graphicPath(element.getAttribute('src')) ? {
    src: element.getAttribute('src'), title: element.getAttribute('title') || 'Interactive graphic', height: Number(element.getAttribute('height')) || 700
  } : undefined,
  toBlockHTML: graphicHTML,
  toPreview: graphicHTML
});

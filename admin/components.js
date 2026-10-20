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

/* global hexo */

hexo.extend.tag.register(
  'dtdd',
  function(args, content) {
    const options = parseTagOptions(args);

    let typespan = '';
    if (options.type) {
      typespan = `<span class="type">${options.type}</span>`;
    }

    let idstr = '';
    if (options.id) {
      idstr = `id="${options.id}"`;
    }
    const namespan = `<span class="name" ${idstr}>${options.name}</span>`;

    return hexo.render
      .render({ text: content, engine: 'md' })
      .then(function(markdownContent) {
        return `<dt>${namespan}${typespan}</dt><dd>${markdownContent}</dd>`;
      });
  },
  { ends: true, async: true }
);

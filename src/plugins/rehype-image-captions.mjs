/**
 * Turn a standalone Markdown image with a title into a semantic figure.
 *
 * Markdown:
 *   ![Alternative text](./robot.jpg "Visible caption")
 *
 * HTML:
 *   <figure class="image-with-caption">
 *     <img src="./robot.jpg" alt="Alternative text">
 *     <figcaption>Visible caption</figcaption>
 *   </figure>
 */
export default function rehypeImageCaptions() {
  return (tree) => transformChildren(tree);
}

function transformChildren(node) {
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    const content = child.children?.filter(
      (item) => item.type !== 'text' || item.value.trim() !== '',
    );
    const image = child.tagName === 'p' && content?.length === 1 ? findImage(content[0]) : undefined;
    const caption = image?.properties?.title;

    if (image && typeof caption === 'string' && caption.trim()) {
      const imageClasses = Array.isArray(image.properties.className)
        ? image.properties.className
        : image.properties.className
          ? [image.properties.className]
          : [];
      const isSized = imageClasses.includes('sized-markdown-image');

      delete image.properties.title;
      child.tagName = 'figure';
      child.properties = {
        className: ['image-with-caption', ...(isSized ? ['sized-markdown-figure'] : [])],
        ...(isSized && typeof image.properties.style === 'string'
          ? { style: image.properties.style }
          : {}),
      };

      if (isSized) {
        const remainingClasses = imageClasses.filter(
          (className) => className !== 'sized-markdown-image',
        );
        if (remainingClasses.length > 0) image.properties.className = remainingClasses;
        else delete image.properties.className;
        delete image.properties.style;
      }

      child.children = [
        content[0],
        {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: caption.trim() }],
        },
      ];
      continue;
    }

    transformChildren(child);
  }
}

function findImage(node) {
  if (node?.type === 'element' && node.tagName === 'img') return node;

  if (node?.type === 'element' && node.tagName === 'a') {
    const content = node.children?.filter(
      (item) => item.type !== 'text' || item.value.trim() !== '',
    );
    if (content?.length === 1 && content[0].type === 'element' && content[0].tagName === 'img') {
      return content[0];
    }
  }
}

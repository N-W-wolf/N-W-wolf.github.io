/**
 * Add an optional width attribute to Markdown images.
 *
 * Example:
 *   ![Robot](./robot.jpg "Caption"){width=50%}
 */
export default function remarkImageSize() {
  return (tree) => transformChildren(tree);
}

function transformChildren(node) {
  if (!Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length - 1; index += 1) {
    const image = node.children[index];
    const attributes = node.children[index + 1];

    if (image.type !== 'image' || attributes.type !== 'text') continue;

    const match = attributes.value.match(
      /^\{\s*width\s*=\s*(\d+(?:\.\d+)?(?:%|px|rem|em|vw)?)\s*\}/,
    );
    if (!match) continue;

    const width = /[a-z%]$/i.test(match[1]) ? match[1] : `${match[1]}px`;
    image.data ??= {};
    image.data.hProperties ??= {};
    image.data.hProperties.className = [
      ...new Set([...(image.data.hProperties.className ?? []), 'sized-markdown-image']),
    ];
    image.data.hProperties.style = `--image-width: ${width}`;

    attributes.value = attributes.value.slice(match[0].length);
    if (!attributes.value) node.children.splice(index + 1, 1);
  }

  for (const child of node.children) transformChildren(child);
}

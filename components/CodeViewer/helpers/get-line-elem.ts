export const getLineElem = (elem: HTMLElement): HTMLElement => {
  if (elem.classList.contains("cm-line")) return elem;
  let node = elem;

  while (node) {
    if (!node.parentElement) break;

    node = node.parentElement;

    if (node.classList.contains("cm-line")) break;
  }

  return node;
};

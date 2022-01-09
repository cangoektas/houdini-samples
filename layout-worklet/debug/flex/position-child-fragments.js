export function positionChildFragments(
  edges,
  childFragments,
  { flexDirection }
) {
  const startIndex = flexDirection === "row" ? 0 : childFragments.length - 1;
  const lastIndex = flexDirection === "row" ? childFragments.length : -1;
  const direction = flexDirection === "row" ? 1 : -1;

  let inlineOffset = edges.inlineStart;
  for (let i = startIndex; i !== lastIndex; i += 1 * direction) {
    const fragment = childFragments[i];
    fragment.inlineOffset = inlineOffset;
    fragment.blockOffset = edges.blockStart;
    inlineOffset += fragment.inlineSize;
  }
}

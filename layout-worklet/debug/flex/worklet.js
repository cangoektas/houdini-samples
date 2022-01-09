import { positionChildFragments } from "./position-child-fragments.js";

registerLayout(
  "flex",
  class {
    static get inputProperties() {
      return ["--flex-direction"];
    }

    async intrinsicSizes() {}

    async layout(children, edges, constraints, styleMap) {
      const flexDirection =
        styleMap.get("--flex-direction").toString().trim() || "row";

      // TODO: The following code only implements something like
      // flex-direction: row and row-reverse. Add support for column and
      // column-reverse
      const availableInlineSize = constraints.fixedInlineSize - edges.inline;
      const availableBlockSize = constraints.fixedBlockSize
        ? constraints.fixedBlockSize - edges.block
        : null;

      let maxChildBlockSize = 0;
      let totalSize = 0;
      let childFragments = await Promise.all(
        children.map(async (child) => {
          const fragment = await child.layoutNextFragment({
            availableInlineSize,
            availableBlockSize,
          });

          maxChildBlockSize = Math.max(maxChildBlockSize, fragment.blockSize);
          totalSize += fragment.inlineSize;

          return fragment;
        })
      );

      if (totalSize < availableInlineSize) {
        // All child fragments have enough space
        positionChildFragments(edges, childFragments, { flexDirection });
      } else {
        // Child fragments are too big and need to shrink to fit
        maxChildBlockSize = 0;
        const maxChildSize = availableInlineSize / children.length;
        childFragments = await Promise.all(
          children.map(async (child) => {
            const fragment = await child.layoutNextFragment({
              fixedInlineSize: maxChildSize,
              availableBlockSize,
            });

            maxChildBlockSize = Math.max(maxChildBlockSize, fragment.blockSize);

            return fragment;
          })
        );
        positionChildFragments(edges, childFragments, { flexDirection });
      }

      const autoBlockSize = maxChildBlockSize + edges.block;

      return { autoBlockSize, childFragments };
    }
  }
);

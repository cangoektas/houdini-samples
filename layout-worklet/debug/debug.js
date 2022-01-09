registerLayout(
  "debug",
  class {
    static get inputProperties() {
      return [
        "--id",
        "--available-inline-size",
        "--available-block-size",
        "--fixed-inline-size",
        "--fixed-block-size",
        "--percentage-inline-size",
        "--percentage-block-size",
      ];
    }

    async intrinsicSizes() {}

    async layout(children, edges, constraints, styleMap) {
      const id = styleMap.get("--id").toString();
      console.log(id, { edges, constraints });
      const [
        availableInlineSize,
        availableBlockSize,
        fixedInlineSize,
        fixedBlockSize,
        percentageInlineSize,
        percentageBlockSize,
      ] = [
        styleMap.get("--available-inline-size"),
        styleMap.get("--available-block-size"),
        styleMap.get("--fixed-inline-size"),
        styleMap.get("--fixed-block-size"),
        styleMap.get("--percentage-inline-size"),
        styleMap.get("--percentage-block-size"),
      ].map((value) => {
        return value.length ? parseInt(value.toString()) : undefined;
      });

      const childFragments = await Promise.all(
        children.map((child) => {
          return child.layoutNextFragment({
            availableInlineSize,
            availableBlockSize,
            fixedInlineSize,
            fixedBlockSize,
            percentageInlineSize,
            percentageBlockSize,
          });
        })
      );

      let autoBlockSize = 0;
      for (let fragment of childFragments) {
        autoBlockSize = Math.max(autoBlockSize, fragment.blockSize);
      }

      return { autoBlockSize, childFragments };
    }
  }
);

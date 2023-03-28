import flatListToHierarchical from "./flatListToHierarchical";

const transformCommerceBlocks = (editorBlocks, commerceProducts) => {
  const products = commerceProducts ?? [];

  const blocskWithProduct = editorBlocks.map((block) => {
    const isCommerceBlock = block.name.startsWith("atlas-shopify-blocks");
    let extendedBlock = block;

    if (isCommerceBlock) {
      try {
        const blockSelectedProduct = JSON.parse(
          extendedBlock.attributes.selectedProduct
        );

        extendedBlock = {
          ...extendedBlock,
          product: products.find(
            (product) => product.id === blockSelectedProduct.value.id
          ),
        };
      } catch (e) {
        console.error("unable to parse block attributes", block.name, e);
      }
    }

    return extendedBlock;
  });

  // console.log("blocskWithProduct", blocskWithProduct);

  return flatListToHierarchical(blocskWithProduct);
};

export default transformCommerceBlocks;

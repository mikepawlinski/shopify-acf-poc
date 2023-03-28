import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import { WordPressBlocksProvider } from "@faustwp/blocks";
import shopifyClient, { Products } from "../utilities/shopifyClient";

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

export async function getStaticProps(ctx) {
  const staticProps = await getWordPressProps({ ctx, revalidate: 5 });
  let shopifyProduts = [];

  try {
    const { data } = await shopifyClient.query({ query: Products });
    const { products } = data;

    shopifyProduts = products.edges.map((edge) => edge.node);
  } catch (e) {}

  if (staticProps.props && shopifyProduts.length) {
    staticProps.props.ecommerce = {
      products: shopifyProduts,
    };
  }

  return staticProps;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

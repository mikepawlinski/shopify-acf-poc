import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import { WordPressBlocksProvider } from "@faustwp/blocks";

const Products = gql`
  query {
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          images(first: 5) {
            nodes {
              src
            }
          }
          variants(first: 50) {
            nodes {
              sku
              title
              image {
                src
              }
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
`;

const store = "blueprintbetatest";
const token = "3accc15150c6fadc731a4763deb6a2ee";
const url = `https://${store}.myshopify.com/api/2023-01/graphql.json`;

const shopifyClient = new ApolloClient({
  link: new createHttpLink({
    uri: url,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

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

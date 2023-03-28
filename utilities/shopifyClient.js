import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";

export const Products = gql`
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

export default shopifyClient;

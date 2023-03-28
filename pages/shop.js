import { gql, useQuery } from "@apollo/client";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import {
  Header,
  Hero,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../components";
import { getNextStaticProps } from "@faustwp/core";
import shopifyClient, { Products } from "../utilities/shopifyClient";
import Image from "next/image";

export default function Page(props) {
  const { data } = useQuery(Page.query, {
    variables: Page.variables(),
  });
  const title = props.title;
  const products = props.ecommerce.products;

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <Hero title={title} />
          <div>
            <h2>Products are fetched directly from Shopify Storefront API</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "block",
                    border: "1px solid black",
                    padding: "16px",
                    width: "33%",
                  }}
                >
                  <h4>{product.title}</h4>
                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <Image
                      src={product.images.nodes[0].src}
                      width={100}
                      height={100}
                    />
                    <div style={{ marginLeft: "1rem" }}>
                      <div>no of variants: {product.variants.nodes.length}</div>
                      <div>
                        price from: ${product.variants.nodes[0].price.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};

export async function getStaticProps(ctx) {
  let shopifyProduts = [];

  try {
    const { data } = await shopifyClient.query({ query: Products });
    const { products } = data;

    shopifyProduts = products.edges.map((edge) => edge.node);
  } catch (e) {}

  return getNextStaticProps(ctx, {
    Page,
    props: {
      title: "Shop all products",
      ecommerce: {
        products: shopifyProduts,
      },
    },
  });
}

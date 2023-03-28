import { gql } from "@apollo/client";
import { WordPressBlocksViewer } from "@faustwp/blocks";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import {
  Header,
  Footer,
  Main,
  Container,
  EntryHeader,
  NavigationMenu,
  ContentWrapper,
  FeaturedImage,
  SEO,
} from "../components";
import transformCommerceBlocks from "../utilities/transformCommerceBlocks";
import { WordPressBlocksProvider } from "@faustwp/blocks";

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const { title, content, featuredImage, date, author, editorBlocks } =
    props.data.post;

  const blocks = transformCommerceBlocks(
    editorBlocks,
    props.ecommerce?.products ?? null
  );

  return (
    <>
      <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
      />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <>
          <EntryHeader
            title={title}
            image={featuredImage?.node}
            date={date}
            author={author?.node?.name}
          />
          <WordPressBlocksProvider
            config={{
              blocks: wpBlocks,
            }}
          >
            <Container>
              <ContentWrapper content={content}></ContentWrapper>
            </Container>
          </WordPressBlocksProvider>
        </>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  query GetPost(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      author {
        node {
          name
        }
      }

      editorBlocks(flat: true) {
        name
        parentClientId
        renderedHtml
        clientId
        parentClientId
        cssClassNames
        ... on AtlasShopifyBlocksProduct {
          name
          clientId
          parentClientId
          attributes {
            selectedProduct
          }
        }
        ... on AtlasShopifyBlocksProductPrice {
          name
          clientId
          parentClientId
          attributes {
            selectedProduct
          }
        }
        ... on CoreColumns {
          attributes {
            cssClassName
            className
          }
        }
        ... on CoreColumn {
          attributes {
            className
            cssClassName
          }
        }
        ... on CoreParagraph {
          attributes {
            className
            cssClassName
            content
          }
        }
      }
      ...FeaturedImageFragment
    }
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

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};

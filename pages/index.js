import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import { WordPressBlocksProvider } from "@faustwp/blocks";

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx, revalidate: 5 });
}

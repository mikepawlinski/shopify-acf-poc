import { WordPressTemplate } from "@faustwp/core";
import { WordPressBlocksProvider } from "@faustwp/blocks";

export default function Preview(props) {
  return <WordPressTemplate {...props} />;
}

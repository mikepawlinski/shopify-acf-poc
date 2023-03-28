import { setConfig } from "@faustwp/core";
import templates from "./wp-templates";
import possibleTypes from "./possibleTypes.json";

import { config as nextConfig } from "@faustjs/next";

nextConfig({
  revalidate: 5,
});

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [],
  experimentalToolbar: true,
  possibleTypes,
});

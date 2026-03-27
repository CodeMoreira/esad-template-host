import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { withESAD } from '@codemoreira/esad/plugin';

/**
 * SuperApp Host Configuration
 * Enhanced by ESAD for Re.Pack + Expo Integration.
 */
export default Repack.defineRspackConfig((env) => {
  return withESAD(env, {
    type: 'host',
    id: 'esad-template-host',
    dirname: __dirname,
  });
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import { withESAD } from '@codemoreira/esad/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SuperApp Host Configuration
 * Powered by ESAD Zero-Config Plugin
 */
export default Repack.defineRspackConfig((env) => {
  return withESAD(env, {
    type: 'host',
    id: 'esad-template-host',
    dirname: __dirname,
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import { ExpoModulesPlugin } from '@callstack/repack-plugin-expo-modules';
import { DefinePlugin, ProvidePlugin } from '@rspack/core';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig((env) => {
  const { platform, dev } = env;
  const isDev = dev !== false;

  console.log('Rspack Build Env:', { platform, isDev, dev });

  return {
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(),
      alias: {
        '@': path.resolve(__dirname, '.'),
        // Fix for Module Federation V2 internal runtime errors
        '@module-federation/runtime/helpers': path.resolve(__dirname, 'node_modules/@module-federation/runtime/dist/helpers.js'),
        '@module-federation/error-codes/browser': path.resolve(__dirname, 'node_modules/@module-federation/error-codes/dist/browser.cjs'),
        '@module-federation/sdk': path.resolve(__dirname, 'node_modules/@module-federation/sdk'),
        ...Repack.getResolveOptions().alias,
      },
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.[cm]?[jt]sx?$/,
              include: [
                /node_modules[\\/]react-native/,
                /node_modules[\\/]@react-native/,
              ],
              type: 'javascript/auto',
              use: {
                loader: '@callstack/repack/babel-swc-loader',
                options: {
                  sourceMaps: true,
                  parallel: true,
                },
              },
            },
            ...Repack.getJsTransformRules(),
          ]
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new ProvidePlugin({
        process: 'process/browser',
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        '__DEV__': JSON.stringify(isDev),
      }),
      new ExpoModulesPlugin(),
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'esad_template_host',
        filename: 'esad_template_host.container.js.bundle',
        remotes: {}, // Dynamic remotes via ScriptManager
        dts: false,
        dev: isDev,
        shared: {
          'react': { singleton: true, eager: true, requiredVersion: pkg.dependencies.react },
          'react/jsx-runtime': { singleton: true, eager: true, requiredVersion: pkg.dependencies.react },
          'react-native': { singleton: true, eager: true, requiredVersion: pkg.dependencies['react-native'] },
          'react-native-safe-area-context': { singleton: true, eager: true, requiredVersion: pkg.dependencies['react-native-safe-area-context'] },
        }
      })
    ],
    devServer: {
      setupMiddlewares: (middlewares) => {
        middlewares.unshift((req, res, next) => {
          if (req.url.startsWith('/.expo/.virtual-metro-entry.bundle')) {
            const query = req.url.split('?')[1];
            const isMap = req.url.includes('.map');
            const target = isMap ? '/index.bundle.map' : '/index.bundle';
            const location = query ? `${target}?${query}` : target;
            res.writeHead(302, {
              Location: location
            });
            res.end();
            return;
          }
          next();
        });
        return middlewares;
      },
    },
  };
});

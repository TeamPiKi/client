// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withShareExtension } = require('expo-share-extension/metro');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/** Sentry 소스맵(Debug ID) 생성을 위해 getDefaultConfig 대신 사용 */
const config = getSentryExpoConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.unstable_enableSymlinks = true;

module.exports = withShareExtension(config, {
  isCSSEnabled: true,
});

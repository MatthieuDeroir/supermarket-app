const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
config.resolver = {};

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, './android/src'),
  '@common': path.resolve(__dirname, './android/src/common'),
  '@modules': path.resolve(__dirname, './android/src/modules'),
  '@public': path.resolve(__dirname, './android/public'),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

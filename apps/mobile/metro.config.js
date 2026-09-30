const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. FORCE SINGLETON INSTANCES of React and React Native across the whole monorepo
const reactPath = require.resolve("react");
const reactJsxRuntimePath = require.resolve("react/jsx-runtime");
const reactJsxDevRuntimePath = require.resolve("react/jsx-dev-runtime");
const reactNativePath = require.resolve("react-native");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react") {
    return {
      filePath: reactPath,
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-runtime") {
    return {
      filePath: reactJsxRuntimePath,
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-dev-runtime") {
    return {
      filePath: reactJsxDevRuntimePath,
      type: "sourceFile",
    };
  }
  if (moduleName === "react-native") {
    return {
      filePath: reactNativePath,
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// 4. Wrap with NativeWind v4
module.exports = withNativeWind(config, { input: "./src/global.css" });

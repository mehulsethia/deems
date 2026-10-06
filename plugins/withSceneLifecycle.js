/**
 * iOS 27 SDK refuses to launch apps that don't adopt the UIScene life cycle.
 * Expo SDK 57 ships ExpoAppSceneDelegate but its generated project doesn't use it yet,
 * so wire it up here. Remove this plugin once Expo's template does it by default.
 */
const { withInfoPlist, withAppDelegate } = require('expo/config-plugins');

const SCENE_DELEGATE = 'EXExpoAppSceneDelegate';

const withSceneManifest = (config) =>
  withInfoPlist(config, (c) => {
    c.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: SCENE_DELEGATE,
          },
        ],
      },
    };
    return c;
  });

const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (c) => {
    let src = c.modResults.contents;
    if (c.modResults.language !== 'swift') throw new Error('withSceneLifecycle expects a Swift AppDelegate');
    if (src.includes('ExpoReactNativeFactoryProvider')) return c;

    const cls = 'class AppDelegate: ExpoAppDelegate {';
    if (!src.includes(cls)) throw new Error('withSceneLifecycle: AppDelegate class declaration not found');
    src = src.replace(cls, 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {');

    // The scene delegate now creates the window and starts React Native.
    const startBlock = /#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\(\n[^)]*\)\n#endif\n\n?/;
    if (!startBlock.test(src)) throw new Error('withSceneLifecycle: startReactNative block not found');
    src = src.replace(startBlock, '');

    c.modResults.contents = src;
    return c;
  });

module.exports = (config) => withSceneAppDelegate(withSceneManifest(config));

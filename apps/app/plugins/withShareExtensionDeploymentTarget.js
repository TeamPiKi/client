const { IOSConfig, withXcodeProject } = require('@expo/config-plugins');

/**
 * expo-share-extension 은 extension 의 IPHONEOS_DEPLOYMENT_TARGET 을 15.1 로 고정함.
 * SDK 58 의 Expo 모듈은 앱과 같은 최소 버전(16.4)을 요구해 extension 빌드가 실패하므로 앱 target 값으로 맞춘다.
 */
const getTargetBuildSettings = (project, targetName) => {
  const nativeTargets = project.pbxNativeTargetSection();
  const configurationLists = project.pbxXCConfigurationList();
  const buildConfigurations = project.pbxXCBuildConfigurationSection();

  const target = Object.values(nativeTargets).find(
    nativeTarget =>
      typeof nativeTarget === 'object' && nativeTarget.name?.replace(/"/g, '') === targetName
  );
  if (!target) return [];

  const configurationList = configurationLists[target.buildConfigurationList];
  return configurationList.buildConfigurations.map(
    ({ value }) => buildConfigurations[value].buildSettings
  );
};

const withShareExtensionDeploymentTarget = config =>
  withXcodeProject(config, modConfig => {
    const project = modConfig.modResults;
    const appTargetName = IOSConfig.XcodeUtils.sanitizedName(modConfig.name);

    const appDeploymentTarget = getTargetBuildSettings(project, appTargetName).find(
      buildSettings => buildSettings.IPHONEOS_DEPLOYMENT_TARGET
    )?.IPHONEOS_DEPLOYMENT_TARGET;
    const extensionBuildSettings = getTargetBuildSettings(
      project,
      `${appTargetName}ShareExtension`
    );

    if (!appDeploymentTarget || extensionBuildSettings.length === 0) {
      throw new Error(
        '[withShareExtensionDeploymentTarget] 앱 또는 Share Extension target 을 찾지 못해 최소 iOS 버전을 맞추지 못했습니다.'
      );
    }

    extensionBuildSettings.forEach(buildSettings => {
      buildSettings.IPHONEOS_DEPLOYMENT_TARGET = appDeploymentTarget;
    });

    return modConfig;
  });

module.exports = withShareExtensionDeploymentTarget;

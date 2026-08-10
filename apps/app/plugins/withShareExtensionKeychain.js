const { IOSConfig, withDangerousMod } = require('@expo/config-plugins');
/** @expo/plist 는 버전에 따라 named / default 로 갈려 둘 다 지원한다 */
const plistModule = require('@expo/plist');
const plist = plistModule.parse ? plistModule : plistModule.default;
const fs = require('fs');
const path = require('path');

const KEYCHAIN_ACCESS_GROUPS = ['$(AppIdentifierPrefix)group.day.no30s.piki'];

/**
 * expo-share-extension은 application-groups만 extension에 복사함.
 * Share Extension에서 TokenStorage를 읽으려면 keychain-access-groups를 extension entitlements에 추가해야 함.
 */
const withShareExtensionKeychain = config =>
  withDangerousMod(config, [
    'ios',
    modConfig => {
      const targetName = `${IOSConfig.XcodeUtils.sanitizedName(modConfig.name)}ShareExtension`;
      const entitlementsPath = path.join(
        modConfig.modRequest.platformProjectRoot,
        targetName,
        `${targetName}.entitlements`
      );

      if (!fs.existsSync(entitlementsPath)) return modConfig;

      const entitlements = plist.parse(fs.readFileSync(entitlementsPath, 'utf8'));
      entitlements['keychain-access-groups'] = KEYCHAIN_ACCESS_GROUPS;
      fs.writeFileSync(entitlementsPath, plist.build(entitlements));

      return modConfig;
    },
  ]);

module.exports = withShareExtensionKeychain;

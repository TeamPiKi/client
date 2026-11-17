import { AppRegistry } from 'react-native';

import { initSentry } from '@/utils/initSentry';

import ShareExtension from './components/ShareBottomSheet';

initSentry({
  enableAutoSessionTracking: false,
  initialScope: { tags: { entry: 'share-extension' } },
});

// IMPORTANT: the first argument to registerComponent, must be "shareExtension"
AppRegistry.registerComponent('shareExtension', () => ShareExtension);

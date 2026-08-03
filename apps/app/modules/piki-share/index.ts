import { requireNativeModule } from 'expo';

type PikiShareNativeModuleT = {
  close: () => void;
  openHostApp: (url: string) => void;
};

/** Android 전용 — iOS 에서 import 하면 네이티브 모듈이 없어 throw 하므로 호출부에서 lazy require */
export default requireNativeModule<PikiShareNativeModuleT>('PikiShare');

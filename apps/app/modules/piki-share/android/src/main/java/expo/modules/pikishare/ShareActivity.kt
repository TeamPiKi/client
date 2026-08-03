package expo.modules.pikishare

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

/**
 * 공유 출처 앱 위에 투명 오버레이로 ShareBottomSheet를 띄우는 Activity.
 * 매니페스트 등록·투명 테마·인텐트 필터는 plugins/withAndroidShareActivity.js 가 주입한다.
 */
class ShareActivity : ReactActivity() {
  /** index.js 에서 AppRegistry.registerComponent 로 등록한 컴포넌트 이름 */
  override fun getMainComponentName(): String = "shareExtension"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
      /** iOS expo-share-extension InitialProps 와 동일한 shape 으로 공유 텍스트 전달 */
      override fun getLaunchOptions(): Bundle =
        Bundle().apply { putString("text", intent.getStringExtra(Intent.EXTRA_TEXT)) }
    }
}

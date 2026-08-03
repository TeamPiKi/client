package expo.modules.pikishare

import android.content.Intent
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/** iOS expo-share-extension 의 close / openHostApp 에 대응하는 Android 구현 */
class PikiShareModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PikiShare")

    /** 공유 바텀시트(ShareActivity)만 닫는다 — MainActivity 를 종료하지 않도록 방어 */
    Function("close") {
      val activity = appContext.currentActivity as? ShareActivity
      activity?.runOnUiThread { activity.finish() }
    }

    /** 딥링크(VIEW 인텐트)로 MainActivity 를 띄우고 시트를 닫는다 */
    Function("openHostApp") { url: String ->
      val activity = appContext.currentActivity as? ShareActivity
      activity?.runOnUiThread {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
          setPackage(activity.packageName)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        activity.startActivity(intent)
        activity.finish()
      }
    }
  }
}

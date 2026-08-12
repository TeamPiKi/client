import ExpoModulesCore
import UIKit

/**
 * 인스타그램 스토리 공유 (iOS).
 *
 * 인스타그램은 일반 이미지 붙여넣기가 아니라 `com.instagram.sharedSticker.*` 전용
 * pasteboard 키를 읽는다. expo-clipboard 로는 이 키를 지정할 수 없어 직접 구현한다.
 * https://developers.facebook.com/docs/instagram-platform/sharing-to-stories/
 */
public class InstagramStoryModule: Module {
  private static let backgroundImageKey = "com.instagram.sharedSticker.backgroundImage"
  private static let scheme = "instagram-stories://share"
  /** 붙여넣기 데이터가 남지 않도록 짧게 만료시킨다 */
  private static let pasteboardExpirySeconds: TimeInterval = 60 * 5

  public func definition() -> ModuleDefinition {
    Name("InstagramStory")

    AsyncFunction("shareBackgroundImage") { (base64: String, facebookAppId: String) -> String in
      guard let imageData = Data(base64Encoded: base64) else {
        return "error"
      }

      // App ID 를 붙이지 않으면 인스타그램이 미지원 안내를 띄운다 (2023-01 이후 필수)
      guard let url = URL(string: "\(Self.scheme)?source_application=\(facebookAppId)") else {
        return "error"
      }

      return await MainActor.run {
        guard UIApplication.shared.canOpenURL(url) else {
          return "notInstalled"
        }

        UIPasteboard.general.setItems(
          [[Self.backgroundImageKey: imageData]],
          options: [.expirationDate: Date().addingTimeInterval(Self.pasteboardExpirySeconds)]
        )

        UIApplication.shared.open(url, options: [:], completionHandler: nil)

        return "success"
      }
    }
  }
}

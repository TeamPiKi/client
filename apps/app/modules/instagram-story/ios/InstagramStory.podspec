Pod::Spec.new do |s|
  s.name           = 'InstagramStory'
  s.version        = '1.0.0'
  s.summary        = 'iOS 인스타그램 스토리 공유 (전용 pasteboard 키)'
  s.description    = '인스타그램이 요구하는 com.instagram.sharedSticker.* pasteboard 키로 이미지를 전달한다.'
  s.author         = ''
  s.homepage       = 'https://github.com/TeamPiKi/client'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end

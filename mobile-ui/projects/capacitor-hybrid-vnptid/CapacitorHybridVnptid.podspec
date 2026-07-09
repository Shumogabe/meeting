require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorHybridVnptid'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target  = '13.0'

  # Add any additional dependencies (if required)
  s.dependency 'Capacitor'
  s.dependency 'FSCalendar'
  s.dependency 'PopupDialog'
  s.dependency 'IQKeyboardManager'
  s.dependency 'SVProgressHUD'
  s.dependency 'SDWebImage'
  s.dependency 'SwiftyJSON'
  s.dependency 'FSPagerView'
  
  # Specify the vendored framework
  s.vendored_frameworks = 'ios/Frameworks/VNPTID.framework'

  s.swift_version = '5.1'
end

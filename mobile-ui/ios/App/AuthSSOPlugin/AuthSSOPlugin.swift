import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(AuthSSOPlugin)
public class AuthSSOPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AuthSSOPlugin"
    public let jsName = "AuthSSO"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signOut", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = AuthSSO()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            AppDelegate.shared.openModalSignIn { (userInfo, userToken, userTokenAccess, userTokenRefresh) in
                if(userInfo != nil){
                    call.resolve([
                        "status": true,
                        "message": "Đăng nhập thành công",
                        "data": userInfo,
                        "token": userToken,
                        "tokenAccess": userTokenAccess,
                        "tokenRefresh": userTokenRefresh
                    ])
                }
                else {
                    call.resolve([
                        "status": false,
                        "message": "Không tìm thấy thông tin tài khoản"
                    ])
                }
            }
        }
    }

    @objc func signOut(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            AppDelegate.shared.onSignOut{ (status) in
                if(status){
                    call.resolve([
                        "status": true,
                        "message": "Đăng xuất tài khoản thành công"
                    ])
                }
                else{
                    call.resolve([
                        "status": false,
                        "message": "Kết nối hệ thống SSO không thành công"
                    ])
                }
            }
        }
    }
}

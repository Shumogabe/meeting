/*
    MOVE TO MAIN PROJECT

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
    ]
    private let implementation = AuthSSO()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
}
*/
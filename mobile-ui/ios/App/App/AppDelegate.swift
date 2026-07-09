import UIKit
import Capacitor
import VNPTID

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, VnptIdDelegate {
    
    var window: UIWindow?
    
    // Singleton để truy cập AppDelegate từ bất kỳ đâu
    static var shared: AppDelegate {
        return UIApplication.shared.delegate as! AppDelegate
    }

    func setRootViewController(_ viewController: UIViewController, animated: Bool = true) {
        guard let window = self.window else {
            fatalError("Window is not initialized")
        }

        // Nếu muốn có hiệu ứng chuyển đổi
        if animated {
            UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve, animations: {
                window.rootViewController = viewController
            }, completion: nil)
        } else {
            window.rootViewController = viewController
        }

        window.makeKeyAndVisible()
    }
    
    //begin VNeID
    var CLIENT_INFO: String = "OyLZHq_sbffZx9SB1lIBFmcSN1oa:OI3SZVZzMJplL4FIMYIasGs90k_hfrtpp4zLHFF3b8wa:TNMT";
    
    var isFinishCall: Bool = false
    var userInfo: String?
    var userToken: String?
    var userTokenAccess: String?
    var userTokenRefresh: String?

    var intervalUserInfo: Timer?
    
    var isGET_USER_INFO_RESULT: Bool = false
    func callBackUserInfoDelegate(_ GET_USER_INFO_RESULT: String) {
        self.userInfo = GET_USER_INFO_RESULT;
        print("GET_USER_INFO_RESULT -> " + GET_USER_INFO_RESULT)
        
        self.isGET_USER_INFO_RESULT = true
        self.checkFinishCall()
    }
    
    var isGET_ID_TOKEN_RESULT: Bool = false
    func callBackIdTokenDelegate(_ GET_ID_TOKEN_RESULT: String) {
        self.userToken = GET_ID_TOKEN_RESULT
        print("GET_ID_TOKEN_RESULT -> " + GET_ID_TOKEN_RESULT)
        
        self.isGET_ID_TOKEN_RESULT = true
        self.checkFinishCall()
    }
    
    var isGET_ACCESS_TOKEN_RESULT: Bool = false
    func callBackAccessTokenDelegate(_ GET_ACCESS_TOKEN_RESULT: String) {
        self.userTokenAccess = GET_ACCESS_TOKEN_RESULT
        print("GET_ACCESS_TOKEN_RESULT -> " + GET_ACCESS_TOKEN_RESULT)
        
        self.isGET_ACCESS_TOKEN_RESULT = true
        self.checkFinishCall()
    }
    
    var isGET_REFRESH_TOKEN_RESULT: Bool = false
    func callBackRefreshTokenDelegate(_ GET_REFRESH_TOKEN_RESULT: String) {
        self.userTokenRefresh = GET_REFRESH_TOKEN_RESULT
        print("GET_REFRESH_TOKEN_RESULT -> " + GET_REFRESH_TOKEN_RESULT)
        
        self.isGET_REFRESH_TOKEN_RESULT = true
        self.checkFinishCall()
    }
    
    func callBackOtpDelegate(_ OPT: String){
        print("callback OPT -> " + OPT)
    }
    
    func callBackMappingAccount(_INFO_MAPPING: String) {
        print("callback INFO_MAPPING -> " + _INFO_MAPPING)
    }
    
    func callBackWhenLogout(_LOGOUT_SUCCESS: Bool) {
        print("callback LOGOUT_SUCCESS -> " + String(_LOGOUT_SUCCESS))
    }
    
    func checkFinishCall() {
        if(self.isGET_USER_INFO_RESULT
            && self.isGET_ID_TOKEN_RESULT
            && self.isGET_ACCESS_TOKEN_RESULT
            && self.isGET_REFRESH_TOKEN_RESULT) {
            
            self.isFinishCall = true
            self.isGET_USER_INFO_RESULT = false
            self.isGET_ID_TOKEN_RESULT = false
            self.isGET_ACCESS_TOKEN_RESULT = false
            self.isGET_REFRESH_TOKEN_RESULT = false
        }
        else {
            self.isFinishCall = false
        }
    }
    
    func openModalSignIn(callback: @escaping (Any?,Any?,Any?,Any?) -> Void) {
        let navFramework = VnptIdNaviVc.naviController();
        //ManangerVnptId.shareIns.RELOGIN = true
        //ManangerVnptId.shareIns.GOTO_SDK_USER_PROFILE = false
        ManangerVnptId.shareIns.ID_TOKEN_SUPER = ""
        ManangerVnptId.shareIns.GET_USER_INFO = true
        ManangerVnptId.shareIns.GET_ID_TOKEN = true
        ManangerVnptId.shareIns.GET_ACCESS_TOKEN = true
        ManangerVnptId.shareIns.GET_REFRESH_TOKEN = true
        ManangerVnptId.shareIns.CLIENT_INFO = self.CLIENT_INFO
        navFramework.modalPresentationStyle = .fullScreen
        navFramework.isNavigationBarHidden = true
        ManangerVnptId.shareIns.delegate = self
        
        //AppDelegate.shared.setRootViewController(navFramework)
        //window?.rootViewController?.present(navFramework, animated: true, completion: {
        if let rootVC = window?.rootViewController, rootVC.isViewLoaded, rootVC.view.window != nil {
            
            rootVC.present(navFramework, animated: true, completion: {
        
                print("INIT data user info")
                
                //wait data
                self.intervalUserInfo = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) {
                    timer in if self.isFinishCall {
                        
                        callback(self.userInfo, self.userToken, self.userTokenAccess, self.userTokenRefresh)
                        
                        //clear data
                        self.isFinishCall  = false
                        
                        //close modal
                        navFramework.dismiss(animated: true, completion: {
                            
                            navFramework.removeFromParent()
                            
                            print("close modal and clear interval")
                            
                            // Invalidate and clear
                            timer.invalidate()
                            
                            // Invalidate and remove the timer when dismissing
                            if let interval = self.intervalUserInfo {
                                interval.invalidate()
                                self.intervalUserInfo = nil
                            }
                        })
                        
                        print("OK data user info")
                    }
                    else {
                        print("WAIT data user info")
                    }
                }
                
                if let interval = self.intervalUserInfo {
                    RunLoop.current.add(interval, forMode: .common)
                }
                
                // Dismiss the modal after some operation
                /*
                self.setTimeout(delay: 300.0) {
                    navFramework.dismiss(animated: true, completion: {
                        print("close modal and clear interval")
                        
                        // Invalidate and remove the timer when dismissing
                        if let interval = self.intervalUserInfo {
                            interval.invalidate()
                            self.intervalUserInfo = nil
                        }
                    })
                }
                */
                
                //test 5s
                /*
                setTimeout(delay: 5.0) {
                    self.userInfo = "{tendangnhap:'demo1',tendaydu:'Tài khoản demo1'}"
                }
                */
            })
        } 
        else {
            print("Root view controller is not ready for presentation.")
        }
    }

    func onSignOut(callback: @escaping (Bool) -> Void){
        ManangerVnptId.shareIns.logOut()
        
        //
        callback(true)
    }
    
    // Function that uses a delay
    func setTimeout(delay: TimeInterval, callback: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
            callback()
        }
    }
    
    //end VNeID

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        //register VNeID
        //pushRootViewController3()
        
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}

//region VNeID
/*
extension AppDelegate {
    
    static var shared: AppDelegate {
        get {
            return UIApplication.shared.delegate as! AppDelegate
        }
    }
    
    func setRootViewController(_ controller: UIViewController?) {
        guard controller != nil else {
            return
        }
        window = UIWindow(frame: UIScreen.main.bounds)
        self.window?.rootViewController = controller
        self.window?.makeKeyAndVisible()
    }
    
}*/
//end region VNeID

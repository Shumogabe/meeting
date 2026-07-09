
import UIKit
import VNPTID

class CustomViewController: UIViewController, VnptIdDelegate {
    
    func callBackRefreshTokenDelegate(_ REFRESH_TOKEN: String) {
        
    }
    
    func callBackAccessTokenDelegate(_ ACSSESS_TOKEN: String) {
        
    }
    
    func callBackMappingAccount(_INFO_MAPPING: String) {
        
    }
    
    func callBackWhenLogout(_LOGOUT_SUCCESS: Bool) {
        print(_LOGOUT_SUCCESS)
    }
    
    func callBackOtpDelegate(_ OPT: String) {

    }
    var token: Data = Data()
    func callBackUserInfoDelegate(_ INFOR_USER_RESULT: String) {

    }
    func callBackIdTokenDelegate(_ ID_TOKEN: String){

    }
    
    @IBOutlet weak var lb: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func loadFramework(_ sender: Any) {
        loadFrameworkAndSettingProperty()
    }
    
    func loadFrameworkAndSettingProperty() {
        ManangerVnptId.shareIns.logOut()
        ManangerVnptId.shareIns.dispose()
        let navFramework = VnptIdNaviVc.naviController()
        navFramework.modalPresentationStyle = .fullScreen
        navFramework.isNavigationBarHidden = true
        ManangerVnptId.shareIns.RELOGIN = true
        ManangerVnptId.shareIns.GET_ID_TOKEN = true
        ManangerVnptId.shareIns.GET_REFRESH_TOKEN = true
        ManangerVnptId.shareIns.GET_ACCESS_TOKEN = true
        ManangerVnptId.shareIns.GET_USER_INFO = true
        ManangerVnptId.shareIns.delegate = self
        ManangerVnptId.shareIns.GOTO_SDK_USER_PROFILE = true
        
        
//        let navFramework = VnptIdNaviVc.naviController();
//        ManangerVnptId.shareIns.GET_USER_INFO = true
//        ManangerVnptId.shareIns.GET_ID_TOKEN = true
//        ManangerVnptId.shareIns.GET_REFRESH_TOKEN = true
//        ManangerVnptId.shareIns.GET_ACCESS_TOKEN = true
//        ManangerVnptId.shareIns.CLIENT_INFO = "xd6djIbKMYjr9LZu_tI3pt3W77Ma:FN1_FJjDaiOw2k3dRdnCgXQCkTEa:digikids"
//        navFramework.modalPresentationStyle = .fullScreen
//                navFramework.isNavigationBarHidden = true
//        ManangerVnptId.shareIns.delegate = self
        
        present(navFramework, animated: true, completion: nil)
    }
    func getSection(_section: String) -> String {
        return ""
    }
   
    
    @IBAction func logout(_ sender: Any) {
//        ManangerVnptId.shareIns.delegate = self
        ManangerVnptId.shareIns.logOut()
    }
    
    
    func signIn() -> [String: Any] {
        return [
            "name": "demo1",
            "pwd": "123456a@"
        ]
    }
}

extension CustomViewController {
    public static func viewVC() -> CustomViewController {
        let view:UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "CustomViewController") as UIViewController
        return view as! CustomViewController
    }
}

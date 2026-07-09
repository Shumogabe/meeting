package monremeeting.hybrid.vnptid;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import vn.gov.monre.meeting.MainActivity;

@CapacitorPlugin(name = "AuthSSO")
public class AuthSSOPlugin extends Plugin {

    private AuthSSO implementation = new AuthSSO();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void signIn(PluginCall call) {
        MainActivity mainActivity = (MainActivity) getActivity();
        JSObject ret = new JSObject();

        if (mainActivity != null) {
            mainActivity.openModalSignIn((data, token, tokenAccess, tokenRefresh) -> {
                if (data != null) {
                    ret.put("status", true);
                    ret.put("message", "Đăng nhập thành công");
                    ret.put("data", data);
                    ret.put("token", token);
                    ret.put("tokenAccess", tokenAccess);
                    ret.put("tokenRefresh", tokenRefresh);
                }
                else{
                    ret.put("status", false);
                    ret.put("data", "Không tìm thấy thông tin tài khoản");
                }
                call.resolve(ret);
            });
        }
        else {
            ret.put("status", false);
            ret.put("message", "Kết nối hệ thống SSO không thành công");
            call.resolve(ret);
        }

    }

    @PluginMethod
    public void signOut(PluginCall call) {
        MainActivity mainActivity = (MainActivity) getActivity();
        JSObject ret = new JSObject();

        if (mainActivity != null) {
            mainActivity.onSignOut((status) -> {
                if (status != null) {
                    ret.put("status", true);
                    ret.put("message", "Đăng xuất tài khoản thành công");
                }
                else{
                    ret.put("status", false);
                    ret.put("data", "Kết nối hệ thống SSO không thành công");
                }
                call.resolve(ret);
            });
        }
        else{
            ret.put("status", false);
            ret.put("data", "Kết nối hệ thống SSO không thành công");
            call.resolve(ret);
        }
    }
}

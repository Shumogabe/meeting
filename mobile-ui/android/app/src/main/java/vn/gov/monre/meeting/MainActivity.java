package vn.gov.monre.meeting;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

import monremeeting.hybrid.vnptid.AuthSSOPlugin;

//interval
import java.util.Timer;
import java.util.TimerTask;
//settimeout
import android.os.Handler;

public class MainActivity extends BridgeActivity {

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(AuthSSOPlugin.class);
    }

    // Define a functional interface for callback
    @FunctionalInterface
    public interface Callback {
        void call(Object data);
    }
    @FunctionalInterface
    public interface Callback4 {
        void call(Object data, Object data2, Object data3, Object data4);
    }

    int type = -1;
    String CLIENT_INFO = "OyLZHq_sbffZx9SB1lIBFmcSN1oa:OI3SZVZzMJplL4FIMYIasGs90k_hfrtpp4zLHFF3b8wa:TNMT";
    
    private Boolean isFinishCall = false;
    private String userInfo = null;
    private String userToken = null;
    private String userTokenAccess = null;
    private String userTokenRefresh = null;

    private Timer timerUserInfo;

    public void openModalSignIn(Callback4 callback){
        type = 9;

        Intent intent = null;
        try {
            intent = new Intent(this, Class.forName("com.vnpt.egov.vnptid.sdk.login.VnptIdLoginWebActivity"));
        } 
        catch (ClassNotFoundException e) {
            e.printStackTrace();
            Log.d("ClassNotFoundException", e.toString());
        }

        if (intent != null) {

            System.out.println("VNeIDLog GET_USER_INFO -> Begin");

            intent.putExtra("CLIENT_INFO", CLIENT_INFO);
            //intent.putExtra("RELOGIN", true);
            //intent.putExtra("GOTO_SDK_USER_PROFILE", false);
            //intent.putExtra("ID_TOKEN_SUPER", "");
            intent.putExtra("GET_USER_INFO", true);
            intent.putExtra("GET_ID_TOKEN", true);
            intent.putExtra("GET_ACCESS_TOKEN", true);
            intent.putExtra("GET_REFRESH_TOKEN", true);
            startActivityForResult(intent, 1);
        }

        //interval 0.5s wait data to callback
        this.timerUserInfo = new Timer();
        TimerTask taskInterval = new TimerTask() {
            @Override
            public void run() {
                if (isFinishCall) {
                    System.out.println("VNeIDLog GET_USER_INFO -> OK data user info");

                    callback.call(userInfo, userToken, userTokenAccess, userTokenRefresh);

                    //clear timer
                    timerUserInfo.cancel();
                    timerUserInfo = null;

                    //back call
                    isFinishCall = false;
                }
                else {
                    System.out.println("VNeIDLog GET_USER_INFO -> WAIT data user info");
                }
            }
        };
        this.timerUserInfo.schedule(taskInterval, 0, 500);

        //timeout with 300s close modal
        /*
        Handler handler = new Handler();
        handler.postDelayed(() -> {
            System.out.println("close modal and clear interval");

            //clear interval
            timerUserInfo.cancel();
            timerUserInfo = null;

            //close modal
            setResult(RESULT_CANCELED);
            finish();

        }, 10000);*/

        //test 5s
        /*
        Handler handlerTest = new Handler();
        handlerTest.postDelayed(() -> {
            userInfo = "{tendangnhap:'demo1',tendaydu:'Tài khoản demo1'}";
        }, 5000);
        */
    }

    public void onSignOut(Callback callback){
        type = 0;

        Intent intent = null;
        try {
            intent = new Intent(this, Class.forName("com.vnpt.egov.vnptid.sdk.login.VnptIdLoginWebActivity"));
        } 
        catch (ClassNotFoundException e) {
            e.printStackTrace();
            Log.d("ClassNotFoundException", e.toString());
        }

        if (intent != null) {
            intent.putExtra("CLIENT_INFO", CLIENT_INFO);
            intent.putExtra("LOGOUT_SDK", true);
            startActivityForResult(intent, 2);
        }
        
        //
        callback.call(true);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Kiểm tra requestCode có trùng với REQUEST_CODE vừa dùng
        if (requestCode == 1) {
            // resultCode được set bởi DetailActivity
            // RESULT_OK chỉ ra rằng kết quả này đã thành công
            if (resultCode == Activity.RESULT_OK) {
                // Nhận dữ liệu từ Intent trả về
                switch (type) {
                    case 0:
                        String strLogout = data.getStringExtra("LOGOUT_SDK_RESULT");
                        System.out.println("VNeIDLog LOGOUT_SDK_RESULT -> " + strLogout);
                        break;
                    case 1:
                        String strDataList = data.getStringExtra("GET_MAPPING_ACCOUNT_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_MAPPING_ACCOUNT_RESULT: " + strDataList, Toast.LENGTH_LONG).show();
                        break;
                    case 2:
                        String strDataInfor = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_ID_TOKEN_RESULT: " + strDataInfor, Toast.LENGTH_LONG).show();
                        break;
                    case 3:
                        String strUserInfo = data.getStringExtra("GET_USER_INFO_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_USER_INFO_RESULT: " + strUserInfo, Toast.LENGTH_LONG).show();
                        break;
                    case 4:
                        String strDataMapping = data.getStringExtra("GET_MAPPING_ACCOUNT_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_MAPPING_ACCOUNT_RESULT: " + strDataMapping, Toast.LENGTH_LONG).show();
                        break;
                    case 5:
                        break;
                    case 6:
                        String Logout = data.getStringExtra("LOGOUT_SDK_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "LOGOUT_SDK_RESULT: " + Logout, Toast.LENGTH_LONG).show();
                        break;
                    case 7:
                        String access = data.getStringExtra("GET_ACCESS_TOKEN_RESULT");
                        String strDataInfor2 = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_ACCESS_TOKEN_RESULT: " + access, Toast.LENGTH_LONG).show();
                        Toast.makeText(this, "GET_ID_TOKEN_RESULT: " + strDataInfor2, Toast.LENGTH_LONG).show();
                        break;
                    case 8:
                        String refreshTokenResult = data.getStringExtra("GET_REFRESH_TOKEN_RESULT");
                        String tokenResult = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "GET_REFRESH_TOKEN_RESULT: " + refreshTokenResult, Toast.LENGTH_LONG).show();
                        Toast.makeText(this, "GET_ID_TOKEN_RESULT: " + tokenResult, Toast.LENGTH_LONG).show();
                        // tokenId = tokenResult;
                        //  refreshToken = refreshTokenResult;

                        Log.e("tokenResult", tokenResult);
                        break;
                    case 9:
                        String str1 = data.getStringExtra("GET_USER_INFO_RESULT");
                        String str2 = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        String str3 = data.getStringExtra("GET_ACCESS_TOKEN_RESULT");
                        String str4 = data.getStringExtra("GET_REFRESH_TOKEN_RESULT");

                        //
                        this.userInfo = str1;
                        this.userToken = str2;
                        this.userTokenAccess = str3;
                        this.userTokenRefresh = str4;
                        this.isFinishCall = true;

                        //
                        System.out.println("VNeIDLog GET_USER_INFO_RESULT -> " + str1);
                        System.out.println("VNeIDLog GET_ID_TOKEN_RESULT -> " + str2);
                        System.out.println("VNeIDLog GET_ACCESS_TOKEN_RESULT -> " + str3);
                        System.out.println("VNeIDLog GET_REFRESH_TOKEN_RESULT -> " + str4);
                        break;
                }
            } 
            else if (resultCode == RESULT_CANCELED){
                // DetailActivity không thành công, không có data trả về.
            }
            else {
                //
            }

            //
            if(type == 3){
                if(this.timerUserInfo != null) {
                    timerUserInfo.cancel();
                }
            }
        }
    }

}

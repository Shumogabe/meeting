package vn.gov.monre.meeting;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivityCheckSDK extends AppCompatActivity {
    int type = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main_activity_check_sdk);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        @SuppressLint({"MissingInflatedId", "LocalSuppress"}) Button buttonOpen = findViewById(R.id.btnOpen);
        buttonOpen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                gotoUserInfo();
            }
        });
        @SuppressLint({"MissingInflatedId", "LocalSuppress"}) Button btnOpenUserInfo = findViewById(R.id.btnOpenUserInfo);
        btnOpenUserInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getUserInfo();
            }
        });
    }
    void signIn(){
        type = 3;
        Intent intent = null;
        try {
            intent = new Intent(this,
                    Class.forName("com.vnpt.egov.vnptid.sdk.login.VnptIdLoginWebActivity"));


        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            Log.d("ClassNotFoundException", e.toString());
        }
        if (intent != null) {
            intent.putExtra("CLIENT_INFO", "xd6djIbKMYjr9LZu_tI3pt3W77Ma:FN1_FJjDaiOw2k3dRdnCgXQCkTEa:digikids");
            intent.putExtra("GET_USER_INFO", true);
            startActivityForResult(intent, 1);
        }
    }
    void gotoUserInfo() {
        type = 5;
        Intent intent = null;
        try {
            intent = new Intent(this,
                    Class.forName("com.vnpt.egov.vnptid.sdk.login.VnptIdLoginWebActivity"));


        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            Log.d("ClassNotFoundException", e.toString());
        }
        if (intent != null) {
            intent.putExtra("CLIENT_INFO", "WexnQ6iDotuf7tSScya8Ifh2g78a:I9xIj8prBWN1vmDUx0SUJiAs8btCtRRv978s82wXnkYa:CQS");
            intent.putExtra("GET_USER_INFO", true);
            startActivityForResult(intent, 2);
        }
    }
    void getUserInfo() {
        type = 3;
        Intent intent = null;
        try {
            intent = new Intent(this,
                    Class.forName("com.vnpt.egov.vnptid.sdk.login.VnptIdLoginWebActivity"));


        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            Log.d("ClassNotFoundException", e.toString());
        }
        if (intent != null) {
            intent.putExtra("CLIENT_INFO", "WexnQ6iDotuf7tSScya8Ifh2g78a:I9xIj8prBWN1vmDUx0SUJiAs8btCtRRv978s82wXnkYa:CQS");
            intent.putExtra("GET_USER_INFO", true);
            startActivityForResult(intent, 1);
        }
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
                    case 1:
                        String strDataList = data.getStringExtra("GET_MAPPING_ACCOUNT_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + strDataList, Toast.LENGTH_LONG).show();
                    case 5:
                        break;
                    case 2:
                        String strDataInfor = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + strDataInfor, Toast.LENGTH_LONG).show();
                        break;
                    case 3:
                        String strUserInfo = data.getStringExtra("GET_USER_INFO_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + strUserInfo, Toast.LENGTH_LONG).show();
                        break;
                    case 4:
                        String strDataMapping = data.getStringExtra("GET_MAPPING_ACCOUNT_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + strDataMapping, Toast.LENGTH_LONG).show();
                        break;
                    case 6:
                        String Logout = data.getStringExtra("LOGOUT_SDK_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + Logout, Toast.LENGTH_LONG).show();
                        break;
                    case 7:
                        String access = data.getStringExtra("GET_ACCESS_TOKEN_RESULT");
                        String strDataInfor2 = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + access, Toast.LENGTH_LONG).show();
                        Toast.makeText(this, "GET_ID_TOKEN_RESULT: " + strDataInfor2, Toast.LENGTH_LONG).show();
                        break;
                    case 8:
                        String refreshTokenResult = data.getStringExtra("GET_REFRESH_TOKEN_RESULT");
                        String tokenResult = data.getStringExtra("GET_ID_TOKEN_RESULT");
                        // Sử dụng kết quả result bằng cách hiện Toast
                        Toast.makeText(this, "Result: " + refreshTokenResult, Toast.LENGTH_LONG).show();
                        Toast.makeText(this, "GET_ID_TOKEN_RESULT: " + tokenResult, Toast.LENGTH_LONG).show();
                        // tokenId = tokenResult;
                        //  refreshToken = refreshTokenResult;

                        Log.e("tokenResult", tokenResult);
                        break;
                }

            } else {
                // DetailActivity không thành công, không có data trả về.
            }
        }
    }
}
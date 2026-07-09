//using Api;
//using Newtonsoft.Json;
//using System;
//using System.Net.Http;
//using System.Text;

//namespace CITI.WebUI.Helpers
//{
//    public class IotHelper
//    {
//        public static string GetThinkBoardToken()
//        {
//            string token = "";
//            try
//            {
//                var httpClient = new HttpClient();

//                var httpRequestMessage = new HttpRequestMessage();
//                httpRequestMessage.Method = HttpMethod.Post;
//                httpRequestMessage.RequestUri = new Uri(Startup.ConnectionStringsThinkBoard + "/api/auth/login");

//                // Tạo StringContent
//                string jsoncontent = JsonConvert.SerializeObject(new { username = Startup.usernametb, password = Startup.passwordtb });
//                var httpContent = new StringContent(jsoncontent, Encoding.UTF8, "application/json");
//                httpRequestMessage.Content = httpContent;

//                var response = httpClient.Send(httpRequestMessage);
//                var responseContent = response.Content.ReadAsStringAsync();
//                token = JsonConvert.DeserializeObject<ThinkBoardToken>(responseContent.Result).token;
//                //Startup.thinkportaccesstoken = token.token;
//            }
//            catch (Exception e)
//            {

//            }
//            return token;
//        }
//    }
//    public class ThinkBoardToken
//    {
//        public string token { get; set; }
//    }
//}

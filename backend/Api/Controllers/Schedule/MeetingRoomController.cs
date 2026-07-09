using HTT.Api.Models;
using HTT.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingRoomController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MeetingRoomController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [NonAction]
        public string Token(JitAuth model)
        {
            var data = new MeetingServerContext().GetById(model.server);
            //string key = _configuration["Jitsi:List:" + data.IP];
            string key = EncryptionHelper.Decrypt(data.Iss, data.Aud);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, _configuration["Jitsi:credentials"]);
            var header = new JwtHeader(credentials);
            JwtPayload payload = new JwtPayload();
            payload.AddClaim(new Claim("iss", data.Iss)); //specifies the application ID which identifies the client. It should be negotiated with the service provider before generating the token.
            payload.AddClaim(new Claim("aud", data.Iss)); //application identifier - indicates what service is consuming the token. It should be negotiated with the service provider before generating the token.
            payload.AddClaim(new Claim("sub", data.IP));
            payload.AddClaim(new Claim("room", model.room));
            payload.AddClaim(new Claim("moderator", model.moderator, ClaimValueTypes.Boolean));
            //payload.AddClaim(new Claim("name", model.room));
            payload.AddClaim(new Claim("exp", model.exp, ClaimValueTypes.Integer64)); //token expiration timestamp as defined in the RFC7519
            var secToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();
            var tokenString = handler.WriteToken(secToken);
            return tokenString;
        }

        //    [HttpPost]
        //    public string Token1(JitAuth model)
        //    {
        //        string key = _configuration["Jitsi:stringKey"];
        //        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        //        var credentials = new SigningCredentials(securityKey, _configuration["Jitsi:credentials"]);
        //        var header = new JwtHeader(credentials);
        //        JwtPayload payload = new JwtPayload();
        //        payload.AddClaim(new Claim("iss", _configuration["Jitsi:iss"])); //specifies the application ID which identifies the client. It should be negotiated with the service provider before generating the token.
        //        payload.AddClaim(new Claim("aud", _configuration["Jitsi:aud"])); //application identifier - indicates what service is consuming the token. It should be negotiated with the service provider before generating the token.
        //        payload.AddClaim(new Claim("sub", _configuration["Jitsi:sub"]));
        //        payload.AddClaim(new Claim("room", model.room));
        //        payload.AddClaim(new Claim("moderator", model.moderator, ClaimValueTypes.Boolean));
        //    //    payload.AddClaim(new Claim("context", @"{
        //    //""user"": {
        //    //    ""avatar"": ""https:/gravatar.com/avatar/abc123"",
        //    //    //""name"": ""John Doe"",
        //    //    ""email"": ""jdoe@example.com"",
        //    //    ""id"": ""abcd:a1b2c3-d4e5f6-0abc1-23de-abcdef01fedcba""
        //    //},
        //    //""group"": ""a123-123-456-789""
        ////}", JsonClaimValueTypes.Json));
        //        payload.AddClaim(new Claim("exp", model.exp, ClaimValueTypes.Integer64)); //token expiration timestamp as defined in the RFC7519
        //        var secToken = new JwtSecurityToken(header, payload);
        //        var handler = new JwtSecurityTokenHandler();
        //        var tokenString = handler.WriteToken(secToken);
        //        return tokenString;
        //    }
    }
}
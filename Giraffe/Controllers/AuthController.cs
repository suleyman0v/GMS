using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Giraffe.Helpers.Auth;
using Giraffe.Model.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Giraffe.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] User userinfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            login lg = new login();
            IActionResult response = Unauthorized();
            List<User> user = lg.AccessLogin(userinfo.email, userinfo.password);
            if (user.Count != 0)
            {
                JwtToken token = new JwtToken();
                var tokenString = token.GenerateJWT(user);
                List<LocalStorage> localStorage = new List<LocalStorage>()
                {
                    new LocalStorage()
                    {
                        id = int.Parse(user[0].id.ToString()),
                        email = userinfo.email,
                        firstName = user[0].firstName,
                        lastName = user[0].lastName,
                        imgPath = user[0].image,
                        companyImage =user[0].companyImage,
                        companyName =user[0].companyName,
                    }
                };

                response = Ok(new
                {
                    token = tokenString,
                    userinfo = localStorage,
                    islogin = 1
                });
            }
            else
            {
                string errorMessage = lg.catchError(userinfo.email, userinfo.password);
                response = Ok(new
                {
                    error = errorMessage,
                    islogin = 0
                });
            }

            return response;
        }
        [HttpPost]
        [Route("ForgotPassword")]
        public IActionResult ForgotPassword([FromBody] ForgotPassword forgotPassword)
        {
            login lg = new login();
            var result = lg.ForgotPassword(forgotPassword.email);
            return Ok(new
            {
                result = result
            });
        }
        [HttpGet]
        [Route("CheckResetToken/{token?}")]
        public IActionResult CheckResetToken(string token)
        {
            login lg = new login();
            var result = lg.CheckResetToken(token);
            return Ok(new
            {
                result = result
            });
        }
        [HttpPost]
        [Route("ResetPassword")]
        public IActionResult ResetPassword([FromBody] ResetPassword resetPassword)
       {
            login lg = new login();
            var result = lg.ResetPassword(resetPassword.password, resetPassword.token);
            return Ok(new
            {
                result = result
            });
        }

    }
}
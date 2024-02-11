using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TurfTimeApi.Context;
using TurfTimeApi.Helpers;
using TurfTimeApi.Models;

namespace TurfTimeApi.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase{
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public UserController(AppDbContext appDbContext, IConfiguration configuration)
        {
            _context = appDbContext;
            _configuration = configuration;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Login loginObject){
            if(loginObject == null){
                return BadRequest();
            }
            var user = await _context.tbl_users.FirstOrDefaultAsync(user=>user.emailId == loginObject.emailId);
            if(user == null){
                return NotFound(new {Message = "User Not Found!"});
            }
            if(!PasswordHasher.VerifyPassword(loginObject.password,user.password)){
                return BadRequest(new {Message = "Password is Incorrect"});
            }

            user.token = CreateJwtToken(user);
            return Ok(new
            {
                Token = user.token,
                Message = "Login Success!"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObject){
            if(userObject == null)
                return BadRequest();

            //Check emailId
            if(await CheckEmailExistAysnc(userObject.emailId))
                return BadRequest(new { Message = "Email Id already exist!"});

            //Check MobileNumber
            if(await CheckMobileNumberExistAysnc(userObject.mobileNumber))
                return BadRequest(new { Message = "Mobile Number already exist!"});

            //Check password strength
            var password = CheckPasswordStrength(userObject.password);
            if(!string.IsNullOrEmpty(password)){
                return BadRequest(new { Message = password});
            }
            userObject.password = PasswordHasher.HashPassword(userObject.password);
            userObject.role = "Admin";
            userObject.token = "";
            userObject.myBookings = null;
            await _context.tbl_users.AddAsync(userObject);
            await _context.SaveChangesAsync();
            return Ok(new {Message = "User Registered!"});
        }

        private async Task<bool> CheckEmailExistAysnc(string emailId){
            return await _context.tbl_users.AnyAsync(user=>user.emailId == emailId);
        }
        private Task<bool> CheckMobileNumberExistAysnc(long mobileNumber)
          => _context.tbl_users.AnyAsync(user=>user.mobileNumber == mobileNumber);

        private string CheckPasswordStrength(string password){
            StringBuilder stringBuilder = new StringBuilder();
            if(password.Length < 8)
                stringBuilder.Append("Minimum Password Length Should be 8"+ Environment.NewLine);
            if(!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password,"[A-Z]") && Regex.IsMatch(password, "[0-9]"))){
                stringBuilder.Append("Password Should be Alphanumeric"+Environment.NewLine);
            }
            if(!Regex.IsMatch(password,"[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]")){
                stringBuilder.Append("Password should contain Special Characters"+Environment.NewLine);
            }
            return stringBuilder.ToString();
        }

        private string CreateJwtToken(User user){
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("welcome to coe training this is jwt token based authentication tutorial");
            var identity = new ClaimsIdentity(new Claim[]{
                new Claim(ClaimTypes.Role, user.role),
                new Claim(ClaimTypes.Name, user.fullName),
                new Claim(ClaimTypes.Email, user.emailId)
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpGet]
        public async Task<ActionResult<User>> GetAllUser(){
            return Ok(await _context.tbl_users
                              .Include(user => user.myBookings)
                              .ThenInclude(booking => booking.timeSlots)
                              .ToListAsync());
        }

        [HttpGet("{emailId}")]
        public async Task<ActionResult<User>> GetUserByEmail(string emailId){
          var user = await _context.tbl_users
                                    .Include(user => user.myBookings)
                                    .ThenInclude(booking => booking.timeSlots)
                                    .FirstOrDefaultAsync(user => user.emailId == emailId);
          if(user == null){
            return NotFound();
          }
          return user;
        }

        [HttpGet("CheckEmailExist")]
        public async Task<ActionResult<bool>> CheckEmailExist(string emailId)
        {
            bool emailExists = await _context.tbl_users.AnyAsync(user => user.emailId == emailId);
            return emailExists;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<User>> PutUser(int id,User user)
        {
            var userDetails = _context.tbl_users.FirstOrDefault(user=>user.userId == id);
            userDetails.fullName = user.fullName;
            userDetails.emailId =  user.emailId;
            userDetails.mobileNumber = user.mobileNumber;

            _context.tbl_users.Update(userDetails);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch]
        [Route("{userId:int}/UpdateBooking")]
        public async Task<ActionResult<User>> UpdateBooking(int userId, [FromBody]JsonPatchDocument<User> modifiedUser){
          if(modifiedUser == null){
            return BadRequest();
          }
          var user = _context.tbl_users
                            .Include(user => user.myBookings)
                            .ThenInclude(booking => booking.timeSlots)
                            .Where(user => user.userId == userId)
                            .FirstOrDefault();
          if(user == null){
            return NotFound();
          }
          modifiedUser.ApplyTo(user);
          await _context.SaveChangesAsync();
          return NoContent();
        }

        [HttpDelete("{bookingId}")]
        public IActionResult DeleteBookingDetails(int bookingId)
        {
            var bookingDetails = _context.tbl_booking_details
                                          .Include(booking => booking.timeSlots)
                                          .FirstOrDefault(booking => booking.bookingId == bookingId);
            if (bookingDetails == null)
            {
                return NotFound("Booking details not found.");
            }
            _context.tbl_timeslot.RemoveRange(bookingDetails.timeSlots);
            _context.tbl_booking_details.Remove(bookingDetails);
            _context.SaveChanges();

            return NoContent();
        }

        /*
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>{
                new Claim(ClaimTypes.Name, user.fullName),
                new Claim(ClaimTypes.Role,"User")
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value
            ));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        */
    }
}

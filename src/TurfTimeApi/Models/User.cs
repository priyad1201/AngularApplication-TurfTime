using System.ComponentModel.DataAnnotations;

namespace TurfTimeApi.Models{
    public class User{
      [Key]
        public int userId { get; set; }
        public string fullName { get; set; }
        public string emailId { get; set; }
        public long mobileNumber { get; set; }
        public string password { get; set; }
        public string token { get; set; }
        public string role { get; set; }
        public List<BookingDetails> myBookings { get; set; }

    }
}

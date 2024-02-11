using System.ComponentModel.DataAnnotations;

namespace TurfTimeApi.Models{
    public class Feedback{
        [Key]
        public int feedbackId { get; set; }
        public int userId { get; set; }
        public string fullName { get; set; }
        public string emailId { get; set; }
        public DateTime feedbackDate { get; set; }
        public int ratings { get; set; }
        public string comments { get; set; }
    }
}
